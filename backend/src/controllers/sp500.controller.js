const axios = require('axios');

const API_KEY = process.env.FINANCE_GREP_API_KEY; // Store your API key in your .env file

const getTopSP500 = async (req, res) => {
  try {    
    const listRes = await axios.get(`https://financialmodelingprep.com/api/v3/sp500_constituent?apikey=${API_KEY}`);
    const companies = listRes.data;

    const marketCaps = await Promise.all(
      companies.slice(0, 50).map(async (company) => {
        try {
          const profileRes = await axios.get(`https://financialmodelingprep.com/api/v3/profile/${company.symbol}?apikey=${API_KEY}`);
          const profile = profileRes.data[0];
          return {
            symbol: company.symbol,
            name: company.name,
            marketCap: profile?.mktCap || 0,
          };
        } catch (err) {
          return { symbol: company.symbol, name: company.name, marketCap: 0 };
        }
      })
    );

    const top10 = marketCaps
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 10);

    res.json(top10);
  } catch (error) {
    console.error('Failed to fetch S&P 500 data:', error);
    res.status(500).json({ error: 'Failed to fetch S&P 500 data' });
  }
};

module.exports = { getTopSP500 };
