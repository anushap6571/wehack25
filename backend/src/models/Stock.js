const mongoose = require('mongoose');
const Stock = require('../models/stock.model');  // Changed from '../models/Stock'

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  companyName: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  industry: String,
  currentPrice: {
    type: Number,
    required: true
  },
  riskMetrics: {
    volatility: Number,        // Standard deviation of returns
    beta: Number,             // Market correlation
    sharpeRatio: Number,      // Risk-adjusted returns
    valueAtRisk: Number,      // Value at Risk (95% confidence)
    maxDrawdown: Number       // Maximum historical drawdown
  },
  technicalIndicators: {
    rsi: Number,              // Relative Strength Index
    macd: Number,             // Moving Average Convergence Divergence
    movingAverages: {
      sma50: Number,          // 50-day Simple Moving Average
      sma200: Number          // 200-day Simple Moving Average
    }
  },
  fundamentalData: {
    marketCap: Number,
    peRatio: Number,
    dividendYield: Number,
    debtToEquity: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.models.Stock || mongoose.model('Stock', stockSchema);