// const axios = require('axios');

// class RiskCalculationService {
//   constructor() {
//     this.alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
//   }

//   // Calculate standard deviation (volatility)
//   calculateVolatility(returns) {
//     const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
//     const squareDiffs = returns.map(value => {
//       const diff = value - mean;
//       return diff * diff;
//     });
//     const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
//     return Math.sqrt(avgSquareDiff);
//   }

//   // Calculate Beta coefficient
//   async calculateBeta(symbol, marketSymbol = 'SPY', period = '1y') {
//     try {
//       const [stockData, marketData] = await Promise.all([
//         this.getHistoricalData(symbol, period),
//         this.getHistoricalData(marketSymbol, period)
//       ]);

//       const stockReturns = this.calculateReturns(stockData);
//       const marketReturns = this.calculateReturns(marketData);

//       const covariance = this.calculateCovariance(stockReturns, marketReturns);
//       const marketVariance = this.calculateVariance(marketReturns);

//       return covariance / marketVariance;
//     } catch (error) {
//       console.error('Error calculating beta:', error);
//       throw error;
//     }
//   }

//   // Calculate Sharpe Ratio
//   calculateSharpeRatio(returns, riskFreeRate = 0.02) {
//     const excessReturns = returns.map(r => r - riskFreeRate);
//     const avgExcessReturn = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
//     const volatility = this.calculateVolatility(returns);
//     return avgExcessReturn / volatility;
//   }

//   // Calculate Value at Risk (VaR)
//   calculateVaR(returns, confidenceLevel = 0.95) {
//     const sortedReturns = [...returns].sort((a, b) => a - b);
//     const index = Math.floor((1 - confidenceLevel) * returns.length);
//     return -sortedReturns[index]; // Negative because VaR is typically expressed as a positive number
//   }

//   // Calculate Maximum Drawdown
//   calculateMaxDrawdown(prices) {
//     let maxDrawdown = 0;
//     let peak = prices[0];

//     for (const price of prices) {
//       if (price > peak) {
//         peak = price;
//       }
//       const drawdown = (peak - price) / peak;
//       maxDrawdown = Math.max(maxDrawdown, drawdown);
//     }

//     return maxDrawdown;
//   }

//   // Helper method to get historical data from Alpha Vantage
//   async getHistoricalData(symbol, period) {
//     try {
//       const response = await axios.get(
//         `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${this.alphaVantageApiKey}`
//       );
//       return this.processHistoricalData(response.data);
//     } catch (error) {
//       console.error('Error fetching historical data:', error);
//       throw error;
//     }
//   }

//   // Helper method to calculate returns from price data
//   calculateReturns(prices) {
//     const returns = [];
//     for (let i = 1; i < prices.length; i++) {
//       returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
//     }
//     return returns;
//   }

//   // Helper method to calculate covariance
//   calculateCovariance(x, y) {
//     const meanX = x.reduce((a, b) => a + b, 0) / x.length;
//     const meanY = y.reduce((a, b) => a + b, 0) / y.length;
//     const diffProducts = x.map((xi, i) => (xi - meanX) * (y[i] - meanY));
//     return diffProducts.reduce((a, b) => a + b, 0) / x.length;
//   }

//   // Helper method to calculate variance
//   calculateVariance(values) {
//     const mean = values.reduce((a, b) => a + b, 0) / values.length;
//     const squareDiffs = values.map(value => {
//       const diff = value - mean;
//       return diff * diff;
//     });
//     return squareDiffs.reduce((a, b) => a + b, 0) / values.length;
//   }

//   // Helper method to process historical data from Alpha Vantage
//   processHistoricalData(data) {
//     const timeSeries = data['Time Series (Daily)'];
//     return Object.values(timeSeries)
//       .map(day => parseFloat(day['5. adjusted close']))
//       .reverse();
//   }
// }

// module.exports = new RiskCalculationService(); 