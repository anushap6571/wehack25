// Sample stock data for testing
const sampleStocks = [
  // Food sector
  {
    symbol: 'MCD',
    companyName: 'McDonald\'s Corporation',
    sector: 'Consumer Staples',
    industry: 'Restaurants',
    currentPrice: 290.50,
    riskMetrics: {
      volatility: 0.18,
      beta: 0.7,
      sharpeRatio: 1.2,
      valueAtRisk: 0.05,
      maxDrawdown: 0.25
    },
    technicalIndicators: {
      rsi: 55,
      macd: {
        value: 2.5,
        signal: 1.8,
        histogram: 0.7
      },
      movingAverages: {
        sma50: 285.30,
        sma200: 275.80
      }
    },
    fundamentalData: {
      marketCap: 210000000000,
      peRatio: 25.3,
      dividendYield: 0.022,
      debtToEquity: 1.8
    }
  },
  {
    symbol: 'KO',
    companyName: 'The Coca-Cola Company',
    sector: 'Consumer Staples',
    industry: 'Beverages',
    currentPrice: 60.25,
    riskMetrics: {
      volatility: 0.15,
      beta: 0.6,
      sharpeRatio: 1.5,
      valueAtRisk: 0.04,
      maxDrawdown: 0.20
    },
    technicalIndicators: {
      rsi: 58,
      macd: {
        value: 1.8,
        signal: 1.5,
        histogram: 0.3
      },
      movingAverages: {
        sma50: 59.80,
        sma200: 58.50
      }
    },
    fundamentalData: {
      marketCap: 260000000000,
      peRatio: 22.8,
      dividendYield: 0.031,
      debtToEquity: 1.5
    }
  },
  
  // Technology sector
  {
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    currentPrice: 175.84,
    riskMetrics: {
      volatility: 0.25,
      beta: 1.2,
      sharpeRatio: 1.5,
      valueAtRisk: 0.15,
      maxDrawdown: 0.3
    },
    technicalIndicators: {
      rsi: 65,
      macd: {
        value: 2.5,
        signal: 1.8,
        histogram: 0.7
      },
      movingAverages: {
        sma50: 170.2,
        sma200: 165.8
      }
    },
    fundamentalData: {
      marketCap: 2750000000000,
      peRatio: 28.5,
      dividendYield: 0.5,
      debtToEquity: 1.8,
      profitMargin: 0.25,
      revenueGrowth: 0.15
    }
  },
  {
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software',
    currentPrice: 338.11,
    riskMetrics: {
      volatility: 0.22,
      beta: 0.9,
      sharpeRatio: 1.8,
      valueAtRisk: 0.12,
      maxDrawdown: 0.25
    },
    technicalIndicators: {
      rsi: 58,
      macd: {
        value: 3.2,
        signal: 2.1,
        histogram: 1.1
      },
      movingAverages: {
        sma50: 335.5,
        sma200: 320.2
      }
    },
    fundamentalData: {
      marketCap: 2510000000000,
      peRatio: 32.1,
      dividendYield: 0.8,
      debtToEquity: 0.3,
      profitMargin: 0.35,
      revenueGrowth: 0.18
    }
  },
  
  // Clothes sector
  {
    symbol: 'NKE',
    companyName: 'Nike, Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Apparel Manufacturing',
    currentPrice: 110.75,
    riskMetrics: {
      volatility: 0.28,
      beta: 1.1,
      sharpeRatio: 1.3,
      valueAtRisk: 0.08,
      maxDrawdown: 0.35
    },
    technicalIndicators: {
      rsi: 48,
      macd: {
        value: -1.2,
        signal: -0.8,
        histogram: -0.4
      },
      movingAverages: {
        sma50: 112.30,
        sma200: 108.50
      }
    },
    fundamentalData: {
      marketCap: 170000000000,
      peRatio: 24.6,
      dividendYield: 0.012,
      debtToEquity: 0.9
    }
  },
  
  // Travel sector
  {
    symbol: 'AAL',
    companyName: 'American Airlines Group Inc.',
    sector: 'Industrials',
    industry: 'Airlines',
    currentPrice: 15.80,
    riskMetrics: {
      volatility: 0.45,
      beta: 1.8,
      sharpeRatio: 0.5,
      valueAtRisk: 0.12,
      maxDrawdown: 0.60
    },
    technicalIndicators: {
      rsi: 42,
      macd: {
        value: -0.8,
        signal: -0.5,
        histogram: -0.3
      },
      movingAverages: {
        sma50: 16.20,
        sma200: 17.50
      }
    },
    fundamentalData: {
      marketCap: 10000000000,
      peRatio: 12.5,
      dividendYield: 0,
      debtToEquity: 3.2
    }
  },
  
  // Sports sector
  {
    symbol: 'DIS',
    companyName: 'The Walt Disney Company',
    sector: 'Communication Services',
    industry: 'Entertainment',
    currentPrice: 95.50,
    riskMetrics: {
      volatility: 0.30,
      beta: 1.3,
      sharpeRatio: 0.9,
      valueAtRisk: 0.09,
      maxDrawdown: 0.40
    },
    technicalIndicators: {
      rsi: 45,
      macd: {
        value: -2.2,
        signal: -1.5,
        histogram: -0.7
      },
      movingAverages: {
        sma50: 98.30,
        sma200: 102.50
      }
    },
    fundamentalData: {
      marketCap: 175000000000,
      peRatio: 18.2,
      dividendYield: 0.016,
      debtToEquity: 0.7
    }
  },
  {
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    currentPrice: 178.75,
    riskMetrics: {
      volatility: 0.28,
      beta: 1.1,
      sharpeRatio: 1.2,
      valueAtRisk: 0.18,
      maxDrawdown: 0.35
    },
    technicalIndicators: {
      rsi: 45,
      macd: {
        value: -1.2,
        signal: -0.8,
        histogram: -0.4
      },
      movingAverages: {
        sma50: 180.5,
        sma200: 175.2
      }
    },
    fundamentalData: {
      marketCap: 1840000000000,
      peRatio: 62.3,
      dividendYield: 0,
      debtToEquity: 1.2,
      profitMargin: 0.05,
      revenueGrowth: 0.12
    }
  },
  {
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    currentPrice: 142.65,
    riskMetrics: {
      volatility: 0.24,
      beta: 1.05,
      sharpeRatio: 1.4,
      valueAtRisk: 0.14,
      maxDrawdown: 0.28
    },
    technicalIndicators: {
      rsi: 52,
      macd: {
        value: 1.8,
        signal: 1.5,
        histogram: 0.3
      },
      movingAverages: {
        sma50: 140.2,
        sma200: 135.8
      }
    },
    fundamentalData: {
      marketCap: 1790000000000,
      peRatio: 25.8,
      dividendYield: 0,
      debtToEquity: 0.05,
      profitMargin: 0.28,
      revenueGrowth: 0.15
    }
  },
  {
    symbol: 'META',
    companyName: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    currentPrice: 474.99,
    riskMetrics: {
      volatility: 0.32,
      beta: 1.3,
      sharpeRatio: 1.6,
      valueAtRisk: 0.2,
      maxDrawdown: 0.4
    },
    technicalIndicators: {
      rsi: 72,
      macd: {
        value: 5.2,
        signal: 3.8,
        histogram: 1.4
      },
      movingAverages: {
        sma50: 460.5,
        sma200: 420.2
      }
    },
    fundamentalData: {
      marketCap: 1210000000000,
      peRatio: 32.5,
      dividendYield: 0,
      debtToEquity: 0.1,
      profitMargin: 0.3,
      revenueGrowth: 0.22
    }
  },
  {
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    currentPrice: 950.02,
    riskMetrics: {
      volatility: 0.35,
      beta: 1.4,
      sharpeRatio: 1.9,
      valueAtRisk: 0.22,
      maxDrawdown: 0.45
    },
    technicalIndicators: {
      rsi: 78,
      macd: {
        value: 8.5,
        signal: 5.2,
        histogram: 3.3
      },
      movingAverages: {
        sma50: 900.5,
        sma200: 750.2
      }
    },
    fundamentalData: {
      marketCap: 2340000000000,
      peRatio: 75.2,
      dividendYield: 0.1,
      debtToEquity: 0.2,
      profitMargin: 0.35,
      revenueGrowth: 0.28
    }
  },
  {
    symbol: 'JNJ',
    companyName: 'Johnson & Johnson',
    sector: 'Healthcare',
    industry: 'Drug Manufacturers',
    currentPrice: 152.05,
    riskMetrics: {
      volatility: 0.18,
      beta: 0.7,
      sharpeRatio: 1.1,
      valueAtRisk: 0.1,
      maxDrawdown: 0.2
    },
    technicalIndicators: {
      rsi: 48,
      macd: {
        value: -0.8,
        signal: -0.5,
        histogram: -0.3
      },
      movingAverages: {
        sma50: 155.2,
        sma200: 158.5
      }
    },
    fundamentalData: {
      marketCap: 367000000000,
      peRatio: 15.8,
      dividendYield: 3.2,
      debtToEquity: 0.4,
      profitMargin: 0.2,
      revenueGrowth: 0.08
    }
  },
  {
    symbol: 'JPM',
    companyName: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    industry: 'Banks',
    currentPrice: 182.63,
    riskMetrics: {
      volatility: 0.22,
      beta: 1.1,
      sharpeRatio: 1.3,
      valueAtRisk: 0.15,
      maxDrawdown: 0.3
    },
    technicalIndicators: {
      rsi: 62,
      macd: {
        value: 2.1,
        signal: 1.5,
        histogram: 0.6
      },
      movingAverages: {
        sma50: 180.5,
        sma200: 175.2
      }
    },
    fundamentalData: {
      marketCap: 526000000000,
      peRatio: 13.2,
      dividendYield: 2.5,
      debtToEquity: 1.8,
      profitMargin: 0.35,
      revenueGrowth: 0.12
    }
  },
  {
    symbol: 'PG',
    companyName: 'Procter & Gamble Co.',
    sector: 'Consumer Staples',
    industry: 'Household & Personal Products',
    currentPrice: 156.84,
    riskMetrics: {
      volatility: 0.15,
      beta: 0.5,
      sharpeRatio: 0.9,
      valueAtRisk: 0.08,
      maxDrawdown: 0.15
    },
    technicalIndicators: {
      rsi: 55,
      macd: {
        value: 1.2,
        signal: 0.8,
        histogram: 0.4
      },
      movingAverages: {
        sma50: 155.5,
        sma200: 152.8
      }
    },
    fundamentalData: {
      marketCap: 370000000000,
      peRatio: 24.5,
      dividendYield: 2.8,
      debtToEquity: 0.6,
      profitMargin: 0.18,
      revenueGrowth: 0.05
    }
  },
  {
    symbol: 'XOM',
    companyName: 'Exxon Mobil Corporation',
    sector: 'Energy',
    industry: 'Oil & Gas Integrated',
    currentPrice: 115.24,
    riskMetrics: {
      volatility: 0.2,
      beta: 1.2,
      sharpeRatio: 1.1,
      valueAtRisk: 0.12,
      maxDrawdown: 0.25
    },
    technicalIndicators: {
      rsi: 58,
      macd: {
        value: 1.5,
        signal: 1.2,
        histogram: 0.3
      },
      movingAverages: {
        sma50: 113.5,
        sma200: 110.2
      }
    },
    fundamentalData: {
      marketCap: 460000000000,
      peRatio: 12.8,
      dividendYield: 3.5,
      debtToEquity: 0.3,
      profitMargin: 0.15,
      revenueGrowth: 0.08
    }
  }
];

module.exports = sampleStocks; 