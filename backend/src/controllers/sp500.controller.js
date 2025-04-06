const axios = require('axios');

const getTopSP500 = async (req, res) => {
  try {    
    const API_KEY = process.env.FINNHUB_API_KEY;
    if (!API_KEY) {
      throw new Error('Finnhub API key is not configured');
    }

    // List of top S&P 500 stocks
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK-B', 'UNH', 'JNJ'];

    // Get quotes for each stock
    const stockDetails = await Promise.all(
      symbols.map(async (symbol) => {
        try {
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
          return { symbol: symbol, name: symbol, marketCap: 0 };
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
