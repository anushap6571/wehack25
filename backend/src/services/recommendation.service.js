// const Stock = require('../models/Stock');
// const riskCalculationService = require('./riskCalculation.service');
// const axios = require('axios');


// class RecommendationService {
//   constructor() {
//     this.alphaVantageApiKey = process.env.ALPHA_VANTAGE_API_KEY;
//   }

//   // Generate recommendations based on user interests and risk tolerance
//   async generateRecommendations(userInterests, riskTolerance) {
//     try {
//       // Get stocks matching user interests
//       const matchingStocks = await this.findStocksByInterests(userInterests);
      
//       // Calculate risk metrics for each stock
//       const stocksWithRisk = await Promise.all(
//         matchingStocks.map(async (stock) => {
//           const historicalData = await riskCalculationService.getHistoricalData(stock.symbol);
//           const returns = riskCalculationService.calculateReturns(historicalData);
          
//           const riskMetrics = {
//             volatility: riskCalculationService.calculateVolatility(returns),
//             beta: await riskCalculationService.calculateBeta(stock.symbol),
//             sharpeRatio: riskCalculationService.calculateSharpeRatio(returns),
//             valueAtRisk: riskCalculationService.calculateVaR(returns),
//             maxDrawdown: riskCalculationService.calculateMaxDrawdown(historicalData)
//           };

//           return {
//             ...stock.toObject(),
//             riskMetrics,
//             recommendationScore: this.calculateRecommendationScore(riskMetrics, riskTolerance)
//           };
//         })
//       );

//       // Sort by recommendation score and return top recommendations
//       return stocksWithRisk
//         .sort((a, b) => b.recommendationScore - a.recommendationScore)
//         .slice(0, 5);
//     } catch (error) {
//       console.error('Error generating recommendations:', error);
//       throw error;
//     }
//   }

//   // Find stocks matching user interests
//   async findStocksByInterests(interests) {
//     try {
//       // Query stocks based on sector and industry
//       const stocks = await Stock.find({
//         $or: [
//           { sector: { $in: interests } },
//           { industry: { $in: interests } }
//         ]
//       });

//       return stocks;
//     } catch (error) {
//       console.error('Error finding stocks by interests:', error);
//       throw error;
//     }
//   }

//   // Calculate recommendation score based on risk metrics and user's risk tolerance
//   calculateRecommendationScore(riskMetrics, riskTolerance) {
//     const {
//       volatility,
//       beta,
//       sharpeRatio,
//       valueAtRisk,
//       maxDrawdown
//     } = riskMetrics;

//     // Normalize risk metrics to 0-1 scale
//     const normalizedVolatility = Math.min(volatility / 0.5, 1); // Assuming 50% volatility is max
//     const normalizedBeta = Math.min(Math.abs(beta) / 2, 1); // Assuming beta of 2 is max
//     const normalizedVaR = Math.min(valueAtRisk / 0.2, 1); // Assuming 20% VaR is max
//     const normalizedDrawdown = Math.min(maxDrawdown / 0.5, 1); // Assuming 50% drawdown is max

//     // Calculate weighted score based on risk tolerance
//     // Lower risk tolerance (0-1) means higher weight for risk metrics
//     const riskWeight = 1 - riskTolerance;
    
//     const score = (
//       (1 - normalizedVolatility * riskWeight) * 0.2 +
//       (1 - normalizedBeta * riskWeight) * 0.2 +
//       (sharpeRatio > 0 ? sharpeRatio / 2 : 0) * 0.3 +
//       (1 - normalizedVaR * riskWeight) * 0.15 +
//       (1 - normalizedDrawdown * riskWeight) * 0.15
//     );

//     return score;
//   }

//   // Update stock data periodically
//   async updateStockData() {
//     try {
//       const stocks = await Stock.find({});
      
//       for (const stock of stocks) {
//         const [quote, company] = await Promise.all([
//           this.getStockQuote(stock.symbol),
//           this.getCompanyInfo(stock.symbol)
//         ]);

//         await Stock.findByIdAndUpdate(stock._id, {
//           currentPrice: quote.price,
//           'fundamentalData.marketCap': company.marketCap,
//           'fundamentalData.peRatio': company.peRatio,
//           'fundamentalData.dividendYield': company.dividendYield,
//           'fundamentalData.debtToEquity': company.debtToEquity,
//           lastUpdated: new Date()
//         });
//       }
//     } catch (error) {
//       console.error('Error updating stock data:', error);
//       throw error;
//     }
//   }

//   // Get real-time stock quote
//   async getStockQuote(symbol) {
//     try {
//       const response = await axios.get(
//         `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageApiKey}`
//       );
//       return {
//         price: parseFloat(response.data['Global Quote']['05. price'])
//       };
//     } catch (error) {
//       console.error('Error fetching stock quote:', error);
//       throw error;
//     }
//   }

//   // Get company information
//   async getCompanyInfo(symbol) {
//     try {
//       const response = await axios.get(
//         `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${this.alphaVantageApiKey}`
//       );
//       return {
//         marketCap: parseFloat(response.data.MarketCapitalization),
//         peRatio: parseFloat(response.data.PERatio),
//         dividendYield: parseFloat(response.data.DividendYield),
//         debtToEquity: parseFloat(response.data.DebtToEquityRatio)
//       };
//     } catch (error) {
//       console.error('Error fetching company info:', error);
//       throw error;
//     }
//   }
// }

// module.exports = new RecommendationService(); 