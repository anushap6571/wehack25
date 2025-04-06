const stockService = require('../services/stock.service');
const Stock = require('../models/stock.model');
const User = require('../models/User');
const stockScraperService = require('../services/stockScraper.service');
const InterestMapperService = require('../services/interestMapper.service');
const imageService = require('../services/image.service');

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

   


  // Get stock recommendations based on user interests and price range
  async getStockRecommendations(req, res) {  
    try {
      const { interests, maxPrice, minPrice } = req.body;
      
      const userId = req.user.userId; 
      const user = await User.findById(userId);
      /*try {
        if (user) {
            // Update user's interests array
            user.interests = interests;  
            user.maxStockPrice = maxPrice;       
            await user.save();
            console.log('Updated user interests:', user.interests);
            console.log('Updated user price:', user.price);
        }
    } catch (userError) {
        console.error('Error updating user interests and user price:', userError);
    }*/


    
    

      
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

      // Get stocks from the database
      console.log('Fetching stocks from database...');
      
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
      
      // Process database stocks
      const recommendations = [];
      let dbStocksAdded = 0;
      
      for (const stock of dbStocks) {
        if (StockController.isWithinPriceRange(stock.currentPrice, minPrice, maxPrice)) {
          const score = StockController.calculateRecommendationScore(stock, sectors, industries);
          const matchedInterests = StockController.getMatchedInterests(stock, interests);
          const image = await imageService.generateCompanyImage(stock.name, stock.industry, stock.sector);
          // Create a simplified stock object with only the essential information
          const simplifiedStock = {
            name: stock.name || stock.companyName || 'Unknown',
            symbol: stock.symbol,
            price: stock.currentPrice,
            recommendationScore: score,
            industry: stock.industry || 'Unknown',
            sector: stock.sector || 'Unknown',
            matchedInterests: matchedInterests,
            image: image
          };
          
          recommendations.push(simplifiedStock);
          dbStocksAdded++;
        }
      }
      
      console.log(`Added ${dbStocksAdded} stocks from database to recommendations`);
      
      // If no recommendations found, return a helpful message
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

      console.log(`Returning ${sortedRecommendations.length} recommendations from database`);

      try {
        
        if (user) {
            // Save the sortedRecommendations array directly to user's recommendations
            user.recommendations = sortedRecommendations;
            await user.save();
            console.log(`Saved ${sortedRecommendations.length} recommendations to user ${userId}`);
          } 
    } catch (userError) {
        console.error('Error saving recommendations to user:', userError);
    }

      // Return a clean, organized response
      res.json({
        success: true,
        totalFound: recommendations.length,
        recommendations: sortedRecommendations,
        filters: {
          sectors,
          industries,
          priceRange: {
            min: minPrice,
            max: maxPrice
          }
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
    
    // Base score for sector match (20 points)
    if (sectors.includes(stock.sector)) {
      score += 20;
    }
    
    // Volatility score (30 points) - More granular tiers
    if (stock.riskMetrics && stock.riskMetrics.volatility) {
      const volatility = stock.riskMetrics.volatility;
      // Lower volatility is better - scale from 0 to 30 points with more granular tiers
      if (volatility <= 0.05) {
        score += 30; // Extremely low volatility
      } else if (volatility <= 0.1) {
        score += 28; // Very low volatility
      } else if (volatility <= 0.15) {
        score += 25; // Low volatility
      } else if (volatility <= 0.2) {
        score += 22; // Moderate-low volatility
      } else if (volatility <= 0.25) {
        score += 18; // Moderate volatility
      } else if (volatility <= 0.3) {
        score += 15; // Moderate-high volatility
      } else if (volatility <= 0.35) {
        score += 12; // High volatility
      } else if (volatility <= 0.4) {
        score += 9; // Very high volatility
      } else if (volatility <= 0.5) {
        score += 6; // Extremely high volatility
      } else {
        score += 3; // Ultra high volatility
      }
    }
    
    // MaxDrawdown score (30 points) - More granular tiers
    if (stock.riskMetrics && stock.riskMetrics.maxDrawdown) {
      const maxDrawdown = stock.riskMetrics.maxDrawdown;
      // Lower maxDrawdown is better - scale from 0 to 30 points with more granular tiers
      if (maxDrawdown <= 0.05) {
        score += 30; // Extremely low drawdown
      } else if (maxDrawdown <= 0.1) {
        score += 28; // Very low drawdown
      } else if (maxDrawdown <= 0.15) {
        score += 25; // Low drawdown
      } else if (maxDrawdown <= 0.2) {
        score += 22; // Moderate-low drawdown
      } else if (maxDrawdown <= 0.25) {
        score += 18; // Moderate drawdown
      } else if (maxDrawdown <= 0.3) {
        score += 15; // Moderate-high drawdown
      } else if (maxDrawdown <= 0.35) {
        score += 12; // High drawdown
      } else if (maxDrawdown <= 0.4) {
        score += 9; // Very high drawdown
      } else if (maxDrawdown <= 0.5) {
        score += 6; // Extremely high drawdown
      } else {
        score += 3; // Ultra high drawdown
      }
    }
    
    // Volume score (20 points) - More granular tiers
    if (stock.volume) {
      const volume = stock.volume;
      // Higher volume is better - scale from 0 to 20 points with more granular tiers
      // Using logarithmic scale to handle large volume differences
      const logVolume = Math.log10(volume);
      
      if (logVolume >= 9) { // 1B+ shares
        score += 20; // Ultra high volume
      } else if (logVolume >= 8.5) { // 500M+ shares
        score += 19; // Extremely high volume
      } else if (logVolume >= 8) { // 100M+ shares
        score += 18; // Very high volume
      } else if (logVolume >= 7.5) { // 50M+ shares
        score += 17; // High volume
      } else if (logVolume >= 7) { // 10M+ shares
        score += 15; // Moderate-high volume
      } else if (logVolume >= 6.5) { // 5M+ shares
        score += 13; // Moderate volume
      } else if (logVolume >= 6) { // 1M+ shares
        score += 11; // Moderate-low volume
      } else if (logVolume >= 5.5) { // 500K+ shares
        score += 9; // Low volume
      } else if (logVolume >= 5) { // 100K+ shares
        score += 7; // Very low volume
      } else if (logVolume >= 4) { // 10K+ shares
        score += 5; // Extremely low volume
      } else if (logVolume >= 3) { // 1K+ shares
        score += 3; // Ultra low volume
      } else {
        score += 1; // Minimal volume
      }
    }
    
    // Add a small random factor (0-5 points) to create more differentiation
    // This ensures that even stocks with identical metrics will have slightly different scores
    const randomFactor = Math.floor(Math.random() * 6);
    score += randomFactor;
    
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