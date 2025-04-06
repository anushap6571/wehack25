const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const Stock = require('../models/stock.model');

// Load environment variables
dotenv.config();

// List of popular stocks to scrape
const popularStocks = [
  // Technology
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'INTC', 'AMD', 'IBM', 'ORCL', 'CRM', 'ADBE', 'CSCO', 'QCOM',
  
  // Healthcare
  'JNJ', 'PFE', 'MRK', 'ABBV', 'TMO', 'ABT', 'UNH', 'LLY', 'BMY', 'AMGN', 'GILD', 'REGN', 'MRNA', 'BNTX', 'VRTX',
  
  // Finance
  'JPM', 'BAC', 'WFC', 'GS', 'MS', 'BLK', 'AXP', 'V', 'MA', 'PYPL', 'SQ', 'COIN', 'HOOD', 'RBLX', 'RKT',
  
  // Consumer
  'PG', 'KO', 'PEP', 'WMT', 'COST', 'TGT', 'HD', 'LOW', 'MCD', 'SBUX', 'NKE', 'DIS', 'NFLX', 'CMCSA', 'T',
  
  // Industrial
  'BA', 'CAT', 'GE', 'HON', 'LMT', 'RTX', 'UNP', 'FDX', 'UPS', 'DE', 'MMM', 'HAL', 'SLB', 'BKR', 'XOM',
  
  // Energy
  'XOM', 'CVX', 'COP', 'EOG', 'PXD', 'VLO', 'MPC', 'PSX', 'OXY', 'DVN', 'PBR', 'SHEL', 'BP', 'TOT', 'ENI',
  
  // Materials
  'LIN', 'APD', 'ECL', 'SHW', 'DD', 'NEM', 'FCX', 'BHP', 'RIO', 'VALE', 'NUE', 'AA', 'X', 'CLF', 'NCLH',
  
  // Real Estate
  'AMT', 'CCI', 'PLD', 'WELL', 'O', 'PSA', 'SPG', 'AVB', 'EQR', 'DLR', 'MAA', 'UDR', 'BXP', 'VTR', 'ARE'
];

// Hardcoded company names mapping
const companyNames = {
  // Technology
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'META': 'Meta Platforms Inc.',
  'NVDA': 'NVIDIA Corporation',
  'TSLA': 'Tesla, Inc.',
  'INTC': 'Intel Corporation',
  'AMD': 'Advanced Micro Devices, Inc.',
  'IBM': 'International Business Machines Corporation',
  'ORCL': 'Oracle Corporation',
  'CRM': 'Salesforce, Inc.',
  'ADBE': 'Adobe Inc.',
  'CSCO': 'Cisco Systems, Inc.',
  'QCOM': 'QUALCOMM Incorporated',
  
  // Healthcare
  'JNJ': 'Johnson & Johnson',
  'PFE': 'Pfizer Inc.',
  'MRK': 'Merck & Co., Inc.',
  'ABBV': 'AbbVie Inc.',
  'TMO': 'Thermo Fisher Scientific Inc.',
  'ABT': 'Abbott Laboratories',
  'UNH': 'UnitedHealth Group Incorporated',
  'LLY': 'Eli Lilly and Company',
  'BMY': 'Bristol-Myers Squibb Company',
  'AMGN': 'Amgen Inc.',
  'GILD': 'Gilead Sciences, Inc.',
  'REGN': 'Regeneron Pharmaceuticals, Inc.',
  'MRNA': 'Moderna, Inc.',
  'BNTX': 'BioNTech SE',
  'VRTX': 'Vertex Pharmaceuticals Incorporated',
  
  // Finance
  'JPM': 'JPMorgan Chase & Co.',
  'BAC': 'Bank of America Corporation',
  'WFC': 'Wells Fargo & Company',
  'GS': 'The Goldman Sachs Group, Inc.',
  'MS': 'Morgan Stanley',
  'BLK': 'BlackRock, Inc.',
  'AXP': 'American Express Company',
  'V': 'Visa Inc.',
  'MA': 'Mastercard Incorporated',
  'PYPL': 'PayPal Holdings, Inc.',
  'SQ': 'Block, Inc.',
  'COIN': 'Coinbase Global, Inc.',
  'HOOD': 'Robinhood Markets, Inc.',
  'RBLX': 'Roblox Corporation',
  'RKT': 'Rocket Companies, Inc.',
  
  // Consumer
  'PG': 'The Procter & Gamble Company',
  'KO': 'The Coca-Cola Company',
  'PEP': 'PepsiCo, Inc.',
  'WMT': 'Walmart Inc.',
  'COST': 'Costco Wholesale Corporation',
  'TGT': 'Target Corporation',
  'HD': 'The Home Depot, Inc.',
  'LOW': "Lowe's Companies, Inc.",
  'MCD': "McDonald's Corporation",
  'SBUX': 'Starbucks Corporation',
  'NKE': 'NIKE, Inc.',
  'DIS': 'The Walt Disney Company',
  'NFLX': 'Netflix, Inc.',
  'CMCSA': 'Comcast Corporation',
  'T': 'AT&T Inc.',
  
  // Industrial
  'BA': 'The Boeing Company',
  'CAT': 'Caterpillar Inc.',
  'GE': 'General Electric Company',
  'HON': 'Honeywell International Inc.',
  'LMT': 'Lockheed Martin Corporation',
  'RTX': 'Raytheon Technologies Corporation',
  'UNP': 'Union Pacific Corporation',
  'FDX': 'FedEx Corporation',
  'UPS': 'United Parcel Service, Inc.',
  'DE': 'Deere & Company',
  'MMM': '3M Company',
  'HAL': 'Halliburton Company',
  'SLB': 'Schlumberger Limited',
  'BKR': 'Baker Hughes Company',
  'XOM': 'Exxon Mobil Corporation',
  
  // Energy
  'CVX': 'Chevron Corporation',
  'COP': 'ConocoPhillips',
  'EOG': 'EOG Resources, Inc.',
  'PXD': 'Pioneer Natural Resources Company',
  'VLO': 'Valero Energy Corporation',
  'MPC': 'Marathon Petroleum Corporation',
  'PSX': 'Phillips 66',
  'OXY': 'Occidental Petroleum Corporation',
  'DVN': 'Devon Energy Corporation',
  'PBR': 'Petróleo Brasileiro S.A. - Petrobras',
  'SHEL': 'Shell plc',
  'BP': 'BP p.l.c.',
  'TOT': 'TotalEnergies SE',
  'ENI': 'Eni S.p.A.',
  
  // Materials
  'LIN': 'Linde plc',
  'APD': 'Air Products and Chemicals, Inc.',
  'ECL': 'Ecolab Inc.',
  'SHW': 'The Sherwin-Williams Company',
  'DD': 'DuPont de Nemours, Inc.',
  'NEM': 'Newmont Corporation',
  'FCX': 'Freeport-McMoRan Inc.',
  'BHP': 'BHP Group Limited',
  'RIO': 'Rio Tinto Group',
  'VALE': 'Vale S.A.',
  'NUE': 'Nucor Corporation',
  'AA': 'Alcoa Corporation',
  'X': 'United States Steel Corporation',
  'CLF': 'Cleveland-Cliffs Inc.',
  'NCLH': 'Norwegian Cruise Line Holdings Ltd.',
  
  // Real Estate
  'AMT': 'American Tower Corporation',
  'CCI': 'Crown Castle Inc.',
  'PLD': 'Prologis, Inc.',
  'WELL': 'Welltower Inc.',
  'O': 'Realty Income Corporation',
  'PSA': 'Public Storage',
  'SPG': 'Simon Property Group, Inc.',
  'AVB': 'AvalonBay Communities, Inc.',
  'EQR': 'Equity Residential',
  'DLR': 'Digital Realty Trust, Inc.',
  'MAA': 'Mid-America Apartment Communities, Inc.',
  'UDR': 'UDR, Inc.',
  'BXP': 'Boston Properties, Inc.',
  'VTR': 'Ventas, Inc.',
  'ARE': 'Alexandria Real Estate Equities, Inc.'
};

// Hardcoded sector and industry mapping
const sectorIndustryMapping = {
  // Technology
  'AAPL': { sector: 'Technology', industry: 'Consumer Electronics' },
  'MSFT': { sector: 'Technology', industry: 'Software' },
  'GOOGL': { sector: 'Communication Services', industry: 'Internet Content & Information' },
  'AMZN': { sector: 'Consumer Cyclical', industry: 'Internet Retail' },
  'META': { sector: 'Communication Services', industry: 'Internet Content & Information' },
  'NVDA': { sector: 'Technology', industry: 'Semiconductors' },
  'TSLA': { sector: 'Consumer Cyclical', industry: 'Auto Manufacturers' },
  'INTC': { sector: 'Technology', industry: 'Semiconductors' },
  'AMD': { sector: 'Technology', industry: 'Semiconductors' },
  'IBM': { sector: 'Technology', industry: 'Information Technology Services' },
  'ORCL': { sector: 'Technology', industry: 'Software' },
  'CRM': { sector: 'Technology', industry: 'Software' },
  'ADBE': { sector: 'Technology', industry: 'Software' },
  'CSCO': { sector: 'Technology', industry: 'Communication Equipment' },
  'QCOM': { sector: 'Technology', industry: 'Semiconductors' },
  
  // Healthcare
  'JNJ': { sector: 'Healthcare', industry: 'Drug Manufacturers' },
  'PFE': { sector: 'Healthcare', industry: 'Drug Manufacturers' },
  'MRK': { sector: 'Healthcare', industry: 'Drug Manufacturers' },
  'ABBV': { sector: 'Healthcare', industry: 'Drug Manufacturers' },
  'TMO': { sector: 'Healthcare', industry: 'Medical Devices' },
  'ABT': { sector: 'Healthcare', industry: 'Medical Devices' },
  'UNH': { sector: 'Healthcare', industry: 'Healthcare Plans' },
  'LLY': { sector: 'Healthcare', industry: 'Drug Manufacturers' },
  'BMY': { sector: 'Healthcare', industry: 'Drug Manufacturers' },
  'AMGN': { sector: 'Healthcare', industry: 'Biotechnology' },
  'GILD': { sector: 'Healthcare', industry: 'Biotechnology' },
  'REGN': { sector: 'Healthcare', industry: 'Biotechnology' },
  'MRNA': { sector: 'Healthcare', industry: 'Biotechnology' },
  'BNTX': { sector: 'Healthcare', industry: 'Biotechnology' },
  'VRTX': { sector: 'Healthcare', industry: 'Biotechnology' },
  
  // Finance
  'JPM': { sector: 'Financial Services', industry: 'Banks' },
  'BAC': { sector: 'Financial Services', industry: 'Banks' },
  'WFC': { sector: 'Financial Services', industry: 'Banks' },
  'GS': { sector: 'Financial Services', industry: 'Capital Markets' },
  'MS': { sector: 'Financial Services', industry: 'Capital Markets' },
  'BLK': { sector: 'Financial Services', industry: 'Asset Management' },
  'AXP': { sector: 'Financial Services', industry: 'Credit Services' },
  'V': { sector: 'Financial Services', industry: 'Credit Services' },
  'MA': { sector: 'Financial Services', industry: 'Credit Services' },
  'PYPL': { sector: 'Financial Services', industry: 'Credit Services' },
  'SQ': { sector: 'Financial Services', industry: 'Software - Infrastructure' },
  'COIN': { sector: 'Financial Services', industry: 'Capital Markets' },
  'HOOD': { sector: 'Financial Services', industry: 'Capital Markets' },
  'RBLX': { sector: 'Communication Services', industry: 'Electronic Gaming & Multimedia' },
  'RKT': { sector: 'Financial Services', industry: 'Mortgage Finance' },
  
  // Consumer
  'PG': { sector: 'Consumer Staples', industry: 'Household & Personal Products' },
  'KO': { sector: 'Consumer Staples', industry: 'Beverages' },
  'PEP': { sector: 'Consumer Staples', industry: 'Beverages' },
  'WMT': { sector: 'Consumer Staples', industry: 'Discount Stores' },
  'COST': { sector: 'Consumer Staples', industry: 'Discount Stores' },
  'TGT': { sector: 'Consumer Cyclical', industry: 'Discount Stores' },
  'HD': { sector: 'Consumer Cyclical', industry: 'Home Improvement Retail' },
  'LOW': { sector: 'Consumer Cyclical', industry: 'Home Improvement Retail' },
  'MCD': { sector: 'Consumer Cyclical', industry: 'Restaurants' },
  'SBUX': { sector: 'Consumer Cyclical', industry: 'Restaurants' },
  'NKE': { sector: 'Consumer Cyclical', industry: 'Apparel Manufacturing' },
  'DIS': { sector: 'Communication Services', industry: 'Entertainment' },
  'NFLX': { sector: 'Communication Services', industry: 'Entertainment' },
  'CMCSA': { sector: 'Communication Services', industry: 'Entertainment' },
  'T': { sector: 'Communication Services', industry: 'Telecom Services' },
  
  // Industrial
  'BA': { sector: 'Industrials', industry: 'Aerospace & Defense' },
  'CAT': { sector: 'Industrials', industry: 'Farm & Heavy Construction Machinery' },
  'GE': { sector: 'Industrials', industry: 'Specialty Industrial Machinery' },
  'HON': { sector: 'Industrials', industry: 'Specialty Industrial Machinery' },
  'LMT': { sector: 'Industrials', industry: 'Aerospace & Defense' },
  'RTX': { sector: 'Industrials', industry: 'Aerospace & Defense' },
  'UNP': { sector: 'Industrials', industry: 'Railroads' },
  'FDX': { sector: 'Industrials', industry: 'Integrated Freight & Logistics' },
  'UPS': { sector: 'Industrials', industry: 'Integrated Freight & Logistics' },
  'DE': { sector: 'Industrials', industry: 'Farm & Heavy Construction Machinery' },
  'MMM': { sector: 'Industrials', industry: 'Specialty Industrial Machinery' },
  'HAL': { sector: 'Energy', industry: 'Oil & Gas Equipment & Services' },
  'SLB': { sector: 'Energy', industry: 'Oil & Gas Equipment & Services' },
  'BKR': { sector: 'Energy', industry: 'Oil & Gas Equipment & Services' },
  'XOM': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  
  // Energy
  'CVX': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  'COP': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  'EOG': { sector: 'Energy', industry: 'Oil & Gas E&P' },
  'PXD': { sector: 'Energy', industry: 'Oil & Gas E&P' },
  'VLO': { sector: 'Energy', industry: 'Oil & Gas Refining & Marketing' },
  'MPC': { sector: 'Energy', industry: 'Oil & Gas Refining & Marketing' },
  'PSX': { sector: 'Energy', industry: 'Oil & Gas Refining & Marketing' },
  'OXY': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  'DVN': { sector: 'Energy', industry: 'Oil & Gas E&P' },
  'PBR': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  'SHEL': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  'BP': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  'TOT': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  'ENI': { sector: 'Energy', industry: 'Oil & Gas Integrated' },
  
  // Materials
  'LIN': { sector: 'Basic Materials', industry: 'Specialty Chemicals' },
  'APD': { sector: 'Basic Materials', industry: 'Specialty Chemicals' },
  'ECL': { sector: 'Basic Materials', industry: 'Specialty Chemicals' },
  'SHW': { sector: 'Basic Materials', industry: 'Specialty Chemicals' },
  'DD': { sector: 'Basic Materials', industry: 'Specialty Chemicals' },
  'NEM': { sector: 'Basic Materials', industry: 'Gold' },
  'FCX': { sector: 'Basic Materials', industry: 'Copper' },
  'BHP': { sector: 'Basic Materials', industry: 'Other Industrial Metals & Mining' },
  'RIO': { sector: 'Basic Materials', industry: 'Other Industrial Metals & Mining' },
  'VALE': { sector: 'Basic Materials', industry: 'Other Industrial Metals & Mining' },
  'NUE': { sector: 'Basic Materials', industry: 'Steel' },
  'AA': { sector: 'Basic Materials', industry: 'Aluminum' },
  'X': { sector: 'Basic Materials', industry: 'Steel' },
  'CLF': { sector: 'Basic Materials', industry: 'Steel' },
  'NCLH': { sector: 'Consumer Cyclical', industry: 'Travel Services' },
  
  // Real Estate
  'AMT': { sector: 'Real Estate', industry: 'REIT - Specialty' },
  'CCI': { sector: 'Real Estate', industry: 'REIT - Specialty' },
  'PLD': { sector: 'Real Estate', industry: 'REIT - Industrial' },
  'WELL': { sector: 'Real Estate', industry: 'REIT - Healthcare Facilities' },
  'O': { sector: 'Real Estate', industry: 'REIT - Retail' },
  'PSA': { sector: 'Real Estate', industry: 'REIT - Industrial' },
  'SPG': { sector: 'Real Estate', industry: 'REIT - Retail' },
  'AVB': { sector: 'Real Estate', industry: 'REIT - Residential' },
  'EQR': { sector: 'Real Estate', industry: 'REIT - Residential' },
  'DLR': { sector: 'Real Estate', industry: 'REIT - Specialty' },
  'MAA': { sector: 'Real Estate', industry: 'REIT - Residential' },
  'UDR': { sector: 'Real Estate', industry: 'REIT - Residential' },
  'BXP': { sector: 'Real Estate', industry: 'REIT - Office' },
  'VTR': { sector: 'Real Estate', industry: 'REIT - Healthcare Facilities' },
  'ARE': { sector: 'Real Estate', industry: 'REIT - Office' }
};

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fetch company info from Yahoo Finance
async function fetchCompanyInfo(symbol) {
  try {
    const response = await axios.get(`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=assetProfile,summaryDetail,defaultKeyStatistics,price`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });
    
    const data = response.data;
    
    if (!data || !data.quoteSummary || !data.quoteSummary.result || data.quoteSummary.result.length === 0) {
      return {};
    }
    
    const result = data.quoteSummary.result[0];
    const assetProfile = result.assetProfile || {};
    const summaryDetail = result.summaryDetail || {};
    const defaultKeyStatistics = result.defaultKeyStatistics || {};
    const price = result.price || {};
    
    return {
      name: assetProfile.longName || symbol,
      sector: assetProfile.sector || 'Unknown',
      industry: assetProfile.industry || 'Unknown',
      description: assetProfile.longBusinessSummary || '',
      marketCap: summaryDetail.marketCap?.raw || 0,
      peRatio: summaryDetail.forwardPE?.raw || 0,
      eps: defaultKeyStatistics.trailingEps?.raw || 0,
      dividendYield: summaryDetail.dividendYield?.raw || 0,
      beta: defaultKeyStatistics.beta?.raw || 1.0,
      dayHigh: price.regularMarketDayHigh?.raw || 0,
      dayLow: price.regularMarketDayLow?.raw || 0,
      yearHigh: price.regularMarketYearHigh?.raw || 0,
      yearLow: price.regularMarketYearLow?.raw || 0,
      fiftyDayAverage: price.fiftyDayAverage?.raw || 0,
      twoHundredDayAverage: price.twoHundredDayAverage?.raw || 0
    };
  } catch (error) {
    console.error(`Error fetching company info for ${symbol}:`, error.message);
    return {};
  }
}

// Fetch stock data using Yahoo Finance API
async function fetchStockData(symbol) {
  try {
    console.log(`Fetching data for ${symbol}...`);
    
    // Get company info first to ensure we have the name
    const companyInfo = await fetchCompanyInfo(symbol);
    
    // Use Yahoo Finance API
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });
    
    const data = response.data;
    
    if (!data || !data.chart || !data.chart.result || data.chart.result.length === 0) {
      throw new Error(`No data returned for ${symbol}`);
    }
    
    const result = data.chart.result[0];
    const meta = result.meta;
    const indicators = result.indicators;
    
    // Extract price data
    const timestamps = result.timestamp;
    const closePrices = indicators.quote[0].close;
    const volumes = indicators.quote[0].volume;
    
    // Get price change directly from the API
    const currentPrice = meta.regularMarketPrice || 0;
    const priceChange = meta.regularMarketChange || 0;
    const priceChangePercent = meta.regularMarketChangePercent || 0;
    const isUp = priceChange >= 0;
    
    // Use hardcoded company name if available, otherwise use the one from API
    const companyName = companyNames[symbol] || companyInfo.name || symbol;
    
    // Use hardcoded sector and industry if available, otherwise use the ones from API
    const sectorIndustry = sectorIndustryMapping[symbol] || { 
      sector: companyInfo.sector || 'Unknown', 
      industry: companyInfo.industry || 'Unknown' 
    };
    
    // Create stock data object
    const stockData = {
      symbol: symbol,
      name: companyName,
      currentPrice: currentPrice,
      priceChange: priceChange,
      priceChangePercent: priceChangePercent,
      isUp: isUp,
      volume: meta.regularMarketVolume || 0,
      marketCap: companyInfo.marketCap || 0,
      sector: sectorIndustry.sector,
      industry: sectorIndustry.industry,
      description: companyInfo.description || '',
      fundamentalData: {
        marketCap: companyInfo.marketCap || 0,
        peRatio: companyInfo.peRatio || 0,
        eps: companyInfo.eps || 0,
        dividendYield: companyInfo.dividendYield || 0
      },
      riskMetrics: {
        volatility: calculateVolatility(closePrices),
        beta: companyInfo.beta || 1.0,
        sharpeRatio: 0, // Would need more data to calculate
        valueAtRisk: 0, // Would need more data to calculate
        maxDrawdown: calculateMaxDrawdown(closePrices)
      },
      historicalData: {
        prices: closePrices,
        volumes: volumes,
        timestamps: timestamps
      },
      lastUpdated: new Date()
    };
    
    // Log the key data points we're capturing
    console.log(`Captured for ${symbol}:`);
    console.log(`- Company Name: ${stockData.name}`);
    console.log(`- Current Price: $${stockData.currentPrice.toFixed(2)}`);
    console.log(`- Price Change: $${stockData.priceChange.toFixed(2)} (${stockData.priceChangePercent.toFixed(2)}%)`);
    console.log(`- Is Up: ${stockData.isUp}`);
    console.log(`- Sector: ${stockData.sector}`);
    console.log(`- Industry: ${stockData.industry}`);
    
    return stockData;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error.message);
    throw error;
  }
}

// Calculate volatility (standard deviation of returns)
function calculateVolatility(prices) {
  if (!prices || prices.length < 2) return 0;
  
  // Calculate returns
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] && prices[i-1] && prices[i-1] !== 0) {
      returns.push((prices[i] - prices[i-1]) / prices[i-1]);
    }
  }
  
  if (returns.length === 0) return 0;
  
  // Calculate mean return
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  
  // Calculate standard deviation
  const squaredDiffs = returns.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length;
  
  return Math.sqrt(variance);
}

// Calculate maximum drawdown
function calculateMaxDrawdown(prices) {
  if (!prices || prices.length < 2) return 0;
  
  let maxDrawdown = 0;
  let peak = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) {
      peak = prices[i];
    } else if (peak > 0) {
      const drawdown = (peak - prices[i]) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown;
}

// Scrape stock data with retry logic
async function scrapeStockWithRetry(symbol, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} for ${symbol}`);
      
      const stockData = await fetchStockData(symbol);
      return stockData;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for ${symbol}:`, error.message);
      
      // Wait before retrying (exponential backoff)
      const waitTime = 5000 * attempt;
      console.log(`Waiting ${waitTime}ms before retry...`);
      await delay(waitTime);
    }
  }
  
  throw lastError;
}

// Scrape and save stock data
async function populateDatabase() {
  try {
    console.log(`Starting to populate database with ${popularStocks.length} stocks...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process stocks in batches to avoid overwhelming the system
    const batchSize = 3;
    for (let i = 0; i < popularStocks.length; i += batchSize) {
      const batch = popularStocks.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1}/${Math.ceil(popularStocks.length/batchSize)}`);
      
      // Process each stock in the batch
      const promises = batch.map(async (symbol) => {
        try {
          console.log(`Processing ${symbol}...`);
          
          // Scrape stock data with retry logic
          const stockData = await scrapeStockWithRetry(symbol);
          
          // Save to database
          await Stock.findOneAndUpdate(
            { symbol: stockData.symbol },
            stockData,
            { upsert: true, new: true }
          );
          
          console.log(`Successfully saved ${symbol} to database`);
          successCount++;
        } catch (error) {
          console.error(`Error processing ${symbol}:`, error.message);
          errorCount++;
        }
      });
      
      // Wait for all stocks in the batch to complete
      await Promise.all(promises);
      
      // Add a delay between batches to avoid rate limiting
      if (i + batchSize < popularStocks.length) {
        console.log('Waiting 15 seconds before next batch...');
        await delay(15000);
      }
    }
    
    console.log(`Database population complete. Success: ${successCount}, Errors: ${errorCount}`);
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
async function run() {
  await connectToDatabase();
  await populateDatabase();
  console.log('Script completed');
}

run().catch(console.error); 