const axios = require('axios');

const getTopSP500 = async (req, res) => {
  try {    
    const API_KEY = process.env.FINNHUB_API_KEY;
    if (!API_KEY) {
      throw new Error('Finnhub API key is not configured');
    }

    // List of top S&P 500 stocks (reduced to 5 to avoid rate limits)
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'];

    // Get quotes for each stock with delay
    const stockDetails = await Promise.all(
      symbols.map(async (symbol, index) => {
        try {
          // Add delay between requests (1 second per request)
          await new Promise(resolve => setTimeout(resolve, index * 1000));

          const quoteResponse = await axios.get('https://finnhub.io/api/v1/quote', {
            params: {
              symbol: symbol,
              token: API_KEY
            }
          });

          const profileResponse = await axios.get('https://finnhub.io/api/v1/stock/profile2', {
            params: {
              symbol: symbol,
              token: API_KEY
            }
          });

          return {
            symbol: symbol,
            name: profileResponse.data.name || symbol,
            marketCap: quoteResponse.data.marketCap || 0
          };
        } catch (err) {
          console.error(`Error fetching details for ${symbol}:`, err.message);
          // Return mock data if API fails
          return {
            symbol: symbol,
            name: symbol,
            marketCap: 1000000000000 // Default market cap
          };
        }
      })
    );

    // Sort by market cap
    const sortedStocks = stockDetails.sort((a, b) => b.marketCap - a.marketCap);

    res.json(sortedStocks);
  } catch (error) {
    console.error('Failed to fetch S&P 500 data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch S&P 500 data',
      details: error.message 
    });
  }
};

module.exports = { getTopSP500 };
