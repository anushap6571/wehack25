const mongoose = require('mongoose');

// Check if the model already exists
const Stock = mongoose.models.Stock || mongoose.model('Stock', new mongoose.Schema({
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
    industry: {
        type: String,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    riskMetrics: {
        volatility: Number,
        beta: Number,
        sharpeRatio: Number,
        valueAtRisk: Number,
        maxDrawdown: Number
    },
    technicalIndicators: {
        rsi: Number,
        macd: {
            value: Number,
            signal: Number,
            histogram: Number
        },
        movingAverages: {
            sma50: Number,
            sma200: Number
        }
    },
    fundamentalData: {
        marketCap: Number,
        peRatio: Number,
        dividendYield: Number,
        debtToEquity: Number,
        profitMargin: Number,
        revenueGrowth: Number
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}));

// Index for faster searches
// Stock.index({ symbol: 1 });
// Stock.index({ sector: 1 });
// Stock.index({ industry: 1 });

module.exports = Stock; 
