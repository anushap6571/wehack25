const mongoose = require('mongoose');

// Check if the model already exists
const Stock = mongoose.models.Stock || mongoose.model('Stock', new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    priceChange: {
        type: Number,
        required: true
    },
    priceChangePercent: {
        type: Number,
        required: true
    },
    isUp: {
        type: Boolean,
        required: true
    },
    volume: {
        type: Number,
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
    description: {
        type: String,
        default: ''
    },
    riskMetrics: {
        volatility: Number,
        beta: Number,
        sharpeRatio: Number,
        valueAtRisk: Number,
        maxDrawdown: Number
    },
    fundamentalData: {
        marketCap: Number,
        peRatio: Number,
        eps: Number,
        dividendYield: Number
    },
    historicalData: {
        prices: [Number],
        volumes: [Number],
        timestamps: [Number]
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
