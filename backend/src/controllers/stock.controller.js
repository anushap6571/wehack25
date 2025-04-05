const stockService = require('../services/stock.service');
const Stock = require('../models/stock.model');
const stockScraperService = require('../services/stockScraper.service');
const InterestMapperService = require('../services/interestMapper.service');

class StockController {
  // Fetch and store stocks for all interest categories
  async fetchStocks(req, res) {
    try {
      const totalStocks = await stockService.fetchStocksForAllInterests();
      
      res.json({
        success: true,
        message: `Successfully fetched and stored ${totalStocks} stocks`,
        totalStocks
      });
    } catch (error) {
      console.error('Error in fetchStocks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stocks'
      });
    }
  }

  // Get all stocks in the database
  async getAllStocks(req, res) {
    try {
      const stocks = await Stock.find({}, 'symbol companyName sector industry currentPrice');
      
      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });
    } catch (error) {
      console.error('Error in getAllStocks:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get stocks'
      });
    }
  }

  // Get stocks by sector
  async getStocksBySector(req, res) {
    try {
      const { sector } = req.params;
      const stocks = await stockService.getStocksBySector(sector);
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get stocks by sector' });
    }
  }

  // Get stocks by industry
  async getStocksByIndustry(req, res) {
    try {
      const { industry } = req.params;
      
      if (!industry) {
        return res.status(400).json({ error: 'Industry parameter is required' });
      }
      
      const stocks = await Stock.find(
        { industry: { $regex: new RegExp(industry, 'i') } },
        'symbol companyName sector industry currentPrice'
      );
      
      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });
    } catch (error) {
      console.error('Error in getStocksByIndustry:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get stocks by industry'
      });
    }
  }

  // Get stock details by symbol
  async getStockBySymbol(req, res) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({ error: 'Symbol parameter is required' });
      }
      
      const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
      
      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      
      res.json({
        success: true,
        data: stock
      });
    } catch (error) {
      console.error('Error in getStockBySymbol:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get stock details'
      });
    }
  }

  async getStockData(req, res) {
    try {
      const { symbol } = req.params;
      const stockData = await stockService.fetchStockData(symbol);
      res.json(stockData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      res.status(500).json({ error: 'Failed to fetch stock data' });
    }
  }

  async searchStocks(req, res) {
    try {
      const { query } = req.query;
      const stocks = await stockService.searchStocks(query);
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search stocks' });
    }
  }

  async getStockRecommendations(req, res) {
    try {
      const { interests, maxPrice, minPrice } = req.body;
      
      if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return res.status(400).json({ 
          error: 'Invalid interests. Please provide an array of interests.' 
        });
      }
      
      // Map user interests to sectors and industries
      const sectors = InterestMapperService.mapInterestsToSectors(interests);
      const industries = InterestMapperService.mapInterestsToIndustries(interests);

      console.log('Searching for stocks in sectors:', sectors);
      console.log('And industries:', industries);

      // Get popular stocks for each sector
      const popularStocks = await this.getPopularStocks(sectors);
      console.log(`Found ${popularStocks.length} popular stocks to analyze`);
      
      // Fetch detailed data for each stock
      const recommendations = [];
      let scrapingSuccessCount = 0;
      let scrapingErrorCount = 0;
      
      // First, try to get stocks from web scraping
      for (const stock of popularStocks) {
        try {
          console.log(`Fetching details for stock: ${stock.symbol}`);
          const stockData = await stockScraperService.fetchStockData(stock.symbol);
          
          // Check if stock matches our sectors or industries and price range
          if ((sectors.includes(stockData.sector) || 
              industries.some(ind => stockData.industry.toLowerCase().includes(ind.toLowerCase()))) &&
              StockController.isWithinPriceRange(stockData.currentPrice, minPrice, maxPrice)) {
            
            console.log(`Found matching stock: ${stock.symbol}`);
            const score = StockController.calculateRecommendationScore(stockData, sectors, industries);
            const matchedInterests = StockController.getMatchedInterests(stockData, interests);
            
            recommendations.push({
              ...stockData,
              recommendationScore: score,
              matchedInterests,
              priceChange: stock.priceChange || 0,
              volume: stock.volume || 0,
              source: 'web-scraping'
            });
          }
          scrapingSuccessCount++;
        } catch (error) {
          scrapingErrorCount++;
          console.error(`Error fetching data for ${stock.symbol}:`, error.message);
          if (error.code === 'ECONNRESET' || error.message.includes('Header overflow')) {
            console.log(`Connection error for ${stock.symbol}, will retry with increased timeout`);
            // Could implement retry logic here if needed
          }
          continue;
        }
      }

      console.log(`Scraping results: ${scrapingSuccessCount} successful, ${scrapingErrorCount} failed`);
      console.log(`Found ${recommendations.length} stocks from web scraping`);

      // Always try to get additional stocks from the database, regardless of whether we found stocks from scraping
      console.log('Fetching additional stocks from database...');
      
      // Try to find stocks in the database that match the sectors or industries
      let dbStocks = [];
      
      try {
        // First try exact sector matches
        console.log(`Searching for stocks with sectors: ${sectors.join(', ')}`);
        dbStocks = await Stock.find({
          sector: { $in: sectors }
        }).limit(20);
        
        console.log(`Found ${dbStocks.length} stocks in database with exact sector matches`);
        
        // If not enough stocks found, try industry matches
        if (dbStocks.length < 5) {
          console.log(`Not enough stocks found, searching for stocks with industries: ${industries.join(', ')}`);
          const industryStocks = await Stock.find({
            industry: { $regex: industries.join('|'), $options: 'i' }
          }).limit(20 - dbStocks.length);
          
          console.log(`Found ${industryStocks.length} additional stocks with industry matches`);
          
          // Combine the results, avoiding duplicates
          const existingSymbols = new Set(dbStocks.map(stock => stock.symbol));
          industryStocks.forEach(stock => {
            if (!existingSymbols.has(stock.symbol)) {
              dbStocks.push(stock);
              existingSymbols.add(stock.symbol);
            }
          });
        }
        
        // If still not enough stocks, get some popular stocks regardless of sector/industry
        if (dbStocks.length < 5) {
          console.log('Still not enough stocks, fetching popular stocks regardless of sector/industry');
          const popularDbStocks = await Stock.find({})
            .sort({ 'fundamentalData.marketCap': -1 })
            .limit(10);
            
          console.log(`Found ${popularDbStocks.length} popular stocks as fallback`);
          
          // Add these stocks, avoiding duplicates
          const existingSymbols = new Set(dbStocks.map(stock => stock.symbol));
          popularDbStocks.forEach(stock => {
            if (!existingSymbols.has(stock.symbol)) {
              dbStocks.push(stock);
              existingSymbols.add(stock.symbol);
            }
          });
        }
      } catch (dbError) {
        console.error('Database query error:', dbError.message);
      }

      console.log(`Found ${dbStocks.length} stocks in database`);

      // Add database stocks to recommendations, avoiding duplicates
      const existingSymbols = new Set(recommendations.map(stock => stock.symbol));
      let dbStocksAdded = 0;
      
      for (const stock of dbStocks) {
        if (!existingSymbols.has(stock.symbol) && 
            StockController.isWithinPriceRange(stock.currentPrice, minPrice, maxPrice)) {
          const score = StockController.calculateRecommendationScore(stock, sectors, industries);
          const matchedInterests = StockController.getMatchedInterests(stock, interests);
          
          recommendations.push({
            ...stock.toObject(),
            recommendationScore: score,
            matchedInterests,
            source: 'database'
          });
          
          existingSymbols.add(stock.symbol);
          dbStocksAdded++;
        }
      }
      
      console.log(`Added ${dbStocksAdded} stocks from database to recommendations`);
      console.log(`Total recommendations: ${recommendations.length} (${recommendations.length - dbStocksAdded} from web scraping, ${dbStocksAdded} from database)`);
      
      // If still no recommendations, return a helpful message
      if (recommendations.length === 0) {
        return res.status(404).json({
          error: 'No stock recommendations found for the given interests and price range.',
          message: 'Try broadening your interests or adjusting your price range.',
          sectors,
          industries,
          priceRange: {
            min: minPrice,
            max: maxPrice
          }
        });
      }

      // Sort recommendations by score and limit to top 20
      const sortedRecommendations = recommendations
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 20);

      console.log(`Returning ${sortedRecommendations.length} recommendations`);

      res.json({
        sectors,
        industries,
        recommendations: sortedRecommendations,
        totalFound: recommendations.length,
        priceRange: {
          min: minPrice,
          max: maxPrice
        }
      });
    } catch (error) {
      console.error('Error in getStockRecommendations:', error);
      res.status(500).json({ 
        error: 'An error occurred while fetching stock recommendations.',
        message: error.message
      });
    }
  }

  async getPopularStocks(sectors) {
    try {
      // This is a simplified approach - in a real app, you'd want to scrape
      // a list of popular stocks from a financial website
      const popularStocksBySector = {
        'Technology': [
          { symbol: 'AAPL', priceChange: 0, volume: 0 },
          { symbol: 'MSFT', priceChange: 0, volume: 0 },
          { symbol: 'GOOGL', priceChange: 0, volume: 0 },
          { symbol: 'AMZN', priceChange: 0, volume: 0 },
          { symbol: 'META', priceChange: 0, volume: 0 },
          { symbol: 'NVDA', priceChange: 0, volume: 0 },
          { symbol: 'TSLA', priceChange: 0, volume: 0 }
        ],
        'Consumer Staples': [
          { symbol: 'PG', priceChange: 0, volume: 0 },
          { symbol: 'KO', priceChange: 0, volume: 0 },
          { symbol: 'PEP', priceChange: 0, volume: 0 },
          { symbol: 'WMT', priceChange: 0, volume: 0 },
          { symbol: 'COST', priceChange: 0, volume: 0 }
        ],
        'Consumer Cyclical': [
          { symbol: 'AMZN', priceChange: 0, volume: 0 },
          { symbol: 'TSLA', priceChange: 0, volume: 0 },
          { symbol: 'HD', priceChange: 0, volume: 0 },
          { symbol: 'NKE', priceChange: 0, volume: 0 },
          { symbol: 'MCD', priceChange: 0, volume: 0 }
        ],
        'Healthcare': [
          { symbol: 'JNJ', priceChange: 0, volume: 0 },
          { symbol: 'PFE', priceChange: 0, volume: 0 },
          { symbol: 'MRK', priceChange: 0, volume: 0 },
          { symbol: 'ABBV', priceChange: 0, volume: 0 },
          { symbol: 'UNH', priceChange: 0, volume: 0 }
        ],
        'Financial Services': [
          { symbol: 'JPM', priceChange: 0, volume: 0 },
          { symbol: 'BAC', priceChange: 0, volume: 0 },
          { symbol: 'WFC', priceChange: 0, volume: 0 },
          { symbol: 'GS', priceChange: 0, volume: 0 },
          { symbol: 'MS', priceChange: 0, volume: 0 }
        ],
        'Communication Services': [
          { symbol: 'GOOGL', priceChange: 0, volume: 0 },
          { symbol: 'META', priceChange: 0, volume: 0 },
          { symbol: 'NFLX', priceChange: 0, volume: 0 },
          { symbol: 'DIS', priceChange: 0, volume: 0 },
          { symbol: 'T', priceChange: 0, volume: 0 }
        ],
        'Industrials': [
          { symbol: 'HON', priceChange: 0, volume: 0 },
          { symbol: 'UNP', priceChange: 0, volume: 0 },
          { symbol: 'UPS', priceChange: 0, volume: 0 },
          { symbol: 'BA', priceChange: 0, volume: 0 },
          { symbol: 'CAT', priceChange: 0, volume: 0 }
        ],
        'Energy': [
          { symbol: 'XOM', priceChange: 0, volume: 0 },
          { symbol: 'CVX', priceChange: 0, volume: 0 },
          { symbol: 'COP', priceChange: 0, volume: 0 },
          { symbol: 'SLB', priceChange: 0, volume: 0 },
          { symbol: 'EOG', priceChange: 0, volume: 0 }
        ],
        'Real Estate': [
          { symbol: 'AMT', priceChange: 0, volume: 0 },
          { symbol: 'PLD', priceChange: 0, volume: 0 },
          { symbol: 'CCI', priceChange: 0, volume: 0 },
          { symbol: 'WELL', priceChange: 0, volume: 0 },
          { symbol: 'EQIX', priceChange: 0, volume: 0 }
        ],
        'Utilities': [
          { symbol: 'NEE', priceChange: 0, volume: 0 },
          { symbol: 'DUK', priceChange: 0, volume: 0 },
          { symbol: 'SO', priceChange: 0, volume: 0 },
          { symbol: 'SRE', priceChange: 0, volume: 0 },
          { symbol: 'AEP', priceChange: 0, volume: 0 }
        ],
        'Materials': [
          { symbol: 'LIN', priceChange: 0, volume: 0 },
          { symbol: 'APD', priceChange: 0, volume: 0 },
          { symbol: 'SHW', priceChange: 0, volume: 0 },
          { symbol: 'ECL', priceChange: 0, volume: 0 },
          { symbol: 'FCX', priceChange: 0, volume: 0 }
        ]
      };

      // Get stocks for the requested sectors
      const stocks = [];
      for (const sector of sectors) {
        if (popularStocksBySector[sector]) {
          stocks.push(...popularStocksBySector[sector]);
        }
      }

      // Remove duplicates
      const uniqueStocks = [];
      const seen = new Set();
      
      for (const stock of stocks) {
        if (!seen.has(stock.symbol)) {
          seen.add(stock.symbol);
          uniqueStocks.push(stock);
        }
      }

      return uniqueStocks;
    } catch (error) {
      console.error('Error getting popular stocks:', error);
      return [];
    }
  }

  static calculateRecommendationScore(stock, sectors, industries) {
    let score = 0;
    
    // Base score for sector match
    if (sectors.includes(stock.sector)) {
      score += 30;
    }
    
    // Additional score for industry match
    const industryMatch = industries.find(ind => 
      stock.industry.toLowerCase().includes(ind.toLowerCase())
    );
    if (industryMatch) {
      score += 20;
    }
    
    // Technical indicators score
    if (stock.technicalIndicators) {
      // RSI score (0-100, 30-70 is healthy)
      const rsi = stock.technicalIndicators.rsi;
      if (rsi >= 30 && rsi <= 70) score += 10;
      
      // MACD score
      if (stock.technicalIndicators.macd.histogram > 0) score += 10;
    }
    
    // Fundamental data score
    if (stock.fundamentalData) {
      // PE ratio score (lower is better, assuming < 30 is good)
      const peRatio = stock.fundamentalData.peRatio;
      if (peRatio > 0 && peRatio < 30) score += 15;
      
      // Market cap score (larger companies tend to be more stable)
      const marketCap = stock.fundamentalData.marketCap;
      if (marketCap > 10000000000) score += 15; // $10B+ market cap
    }
    
    // Risk metrics score
    if (stock.riskMetrics) {
      // Lower volatility is better
      const volatility = stock.riskMetrics.volatility;
      if (volatility < 0.3) score += 10; // Less than 30% volatility
    }
    
    return score;
  }

  static getMatchedInterests(stock, interests) {
    return interests.filter(interest => {
      const industry = stock.industry.toLowerCase();
      return industry.includes(interest.toLowerCase());
    });
  }

  static isWithinPriceRange(price, minPrice, maxPrice) {
    if (!price) return false;
    if (minPrice && price < minPrice) return false;
    if (maxPrice && price > maxPrice) return false;
    return true;
  }

  // Method to update the database with stock data
  async updateStockDatabase() {
    try {
      console.log('Starting database update for stocks...');
      
      // Get a list of popular stocks to update
      const popularStocks = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'PG',
        'KO', 'PEP', 'WMT', 'COST', 'JNJ', 'PFE', 'MRK', 'ABBV', 'TMO', 'ABT',
        'XOM', 'CVX', 'COP', 'EOG', 'PXD', 'HD', 'LOW', 'BA', 'CAT', 'GE',
        'DIS', 'NFLX', 'CMCSA', 'T', 'VZ', 'TMUS', 'INTC', 'AMD', 'IBM', 'ORCL'
      ];
      
      let updatedCount = 0;
      let errorCount = 0;
      
      for (const symbol of popularStocks) {
        try {
          console.log(`Updating database for ${symbol}...`);
          
          // Try to get stock data from scraper
          const stockData = await stockScraperService.fetchStockData(symbol);
          
          // Update or create the stock in the database
          await Stock.findOneAndUpdate(
            { symbol: stockData.symbol },
            stockData,
            { upsert: true, new: true }
          );
          
          updatedCount++;
          console.log(`Successfully updated ${symbol} in database`);
        } catch (error) {
          errorCount++;
          console.error(`Error updating ${symbol}:`, error.message);
          
          // If scraping fails, try to get basic data from a more reliable source
          try {
            // This is a simplified example - in a real app, you'd use a more reliable API
            const basicData = {
              symbol: symbol,
              companyName: symbol, // Placeholder
              sector: 'Unknown',
              industry: 'Unknown',
              currentPrice: 0,
              lastUpdated: new Date()
            };
            
            await Stock.findOneAndUpdate(
              { symbol: symbol },
              basicData,
              { upsert: true, new: true }
            );
            
            console.log(`Added basic data for ${symbol} as fallback`);
          } catch (fallbackError) {
            console.error(`Fallback also failed for ${symbol}:`, fallbackError.message);
          }
        }
      }
      
      console.log(`Database update complete. Updated: ${updatedCount}, Errors: ${errorCount}`);
      return { updatedCount, errorCount };
    } catch (error) {
      console.error('Error updating stock database:', error);
      throw error;
    }
  }
}

module.exports = new StockController(); 