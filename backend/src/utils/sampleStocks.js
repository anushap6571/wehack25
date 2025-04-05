// Sample stock data for testing
const sampleStocks = [
  // Food sector
  {
    symbol: 'MCD',
    name: 'McDonald\'s Corporation',
    sector: 'Consumer Staples',
    industry: 'Restaurants',
    currentPrice: 290.50,
    priceChange: 2.75,
    priceChangePercent: 0.96,
    isUp: true,
    volume: 3500000,
    marketCap: 210000000000,
    description: 'McDonald\'s Corporation operates and franchises McDonald\'s restaurants in the United States and internationally.',
    fundamentalData: {
      marketCap: 210000000000,
      peRatio: 25.3,
      eps: 11.48,
      dividendYield: 0.022
    },
    riskMetrics: {
      volatility: 0.18,
      beta: 0.7,
      sharpeRatio: 1.2,
      valueAtRisk: 0.05,
      maxDrawdown: 0.25
    },
    historicalData: {
      prices: [285.30, 287.20, 289.10, 290.50],
      volumes: [3200000, 3400000, 3300000, 3500000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'KO',
    name: 'The Coca-Cola Company',
    sector: 'Consumer Staples',
    industry: 'Beverages',
    currentPrice: 60.25,
    priceChange: -0.35,
    priceChangePercent: -0.58,
    isUp: false,
    volume: 4200000,
    marketCap: 260000000000,
    description: 'The Coca-Cola Company is a beverage company that manufactures and distributes various nonalcoholic beverages worldwide.',
    fundamentalData: {
      marketCap: 260000000000,
      peRatio: 22.8,
      eps: 2.64,
      dividendYield: 0.031
    },
    riskMetrics: {
      volatility: 0.15,
      beta: 0.6,
      sharpeRatio: 1.5,
      valueAtRisk: 0.04,
      maxDrawdown: 0.20
    },
    historicalData: {
      prices: [59.80, 60.10, 60.60, 60.25],
      volumes: [4100000, 4300000, 4200000, 4200000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  
  // Technology sector
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    currentPrice: 175.84,
    priceChange: 3.25,
    priceChangePercent: 1.88,
    isUp: true,
    volume: 78000000,
    marketCap: 2750000000000,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    fundamentalData: {
      marketCap: 2750000000000,
      peRatio: 28.5,
      eps: 6.17,
      dividendYield: 0.005
    },
    riskMetrics: {
      volatility: 0.25,
      beta: 1.2,
      sharpeRatio: 1.5,
      valueAtRisk: 0.15,
      maxDrawdown: 0.3
    },
    historicalData: {
      prices: [170.20, 172.50, 174.30, 175.84],
      volumes: [75000000, 76000000, 77000000, 78000000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software',
    currentPrice: 338.11,
    priceChange: 5.75,
    priceChangePercent: 1.73,
    isUp: true,
    volume: 22000000,
    marketCap: 2510000000000,
    description: 'Microsoft Corporation develops, licenses, and supports computer software, consumer electronics, personal computers, and related services.',
    fundamentalData: {
      marketCap: 2510000000000,
      peRatio: 32.1,
      eps: 10.53,
      dividendYield: 0.008
    },
    riskMetrics: {
      volatility: 0.22,
      beta: 0.9,
      sharpeRatio: 1.8,
      valueAtRisk: 0.12,
      maxDrawdown: 0.25
    },
    historicalData: {
      prices: [335.50, 336.80, 337.50, 338.11],
      volumes: [21000000, 21500000, 21800000, 22000000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  
  // Clothes sector
  {
    symbol: 'NKE',
    name: 'Nike, Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Apparel Manufacturing',
    currentPrice: 110.75,
    priceChange: -1.25,
    priceChangePercent: -1.12,
    isUp: false,
    volume: 5800000,
    marketCap: 170000000000,
    description: 'Nike, Inc. designs, develops, markets, and sells athletic footwear, apparel, equipment, and accessories worldwide.',
    fundamentalData: {
      marketCap: 170000000000,
      peRatio: 24.6,
      eps: 4.50,
      dividendYield: 0.012
    },
    riskMetrics: {
      volatility: 0.28,
      beta: 1.1,
      sharpeRatio: 1.3,
      valueAtRisk: 0.08,
      maxDrawdown: 0.35
    },
    historicalData: {
      prices: [112.30, 111.80, 111.20, 110.75],
      volumes: [5500000, 5600000, 5700000, 5800000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  
  // Travel sector
  {
    symbol: 'AAL',
    name: 'American Airlines Group Inc.',
    sector: 'Industrials',
    industry: 'Airlines',
    currentPrice: 15.80,
    priceChange: -0.45,
    priceChangePercent: -2.77,
    isUp: false,
    volume: 12500000,
    marketCap: 10000000000,
    description: 'American Airlines Group Inc. operates as a network air carrier that provides scheduled air transportation services for passengers and cargo.',
    fundamentalData: {
      marketCap: 10000000000,
      peRatio: 12.5,
      eps: 1.26,
      dividendYield: 0
    },
    riskMetrics: {
      volatility: 0.45,
      beta: 1.8,
      sharpeRatio: 0.5,
      valueAtRisk: 0.12,
      maxDrawdown: 0.60
    },
    historicalData: {
      prices: [16.20, 16.10, 15.95, 15.80],
      volumes: [12000000, 12200000, 12300000, 12500000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  
  // Sports sector
  {
    symbol: 'DIS',
    name: 'The Walt Disney Company',
    sector: 'Communication Services',
    industry: 'Entertainment',
    currentPrice: 95.50,
    priceChange: -1.25,
    priceChangePercent: -1.29,
    isUp: false,
    volume: 8500000,
    marketCap: 175000000000,
    description: 'The Walt Disney Company, together with its subsidiaries, operates as an entertainment company worldwide.',
    fundamentalData: {
      marketCap: 175000000000,
      peRatio: 18.2,
      eps: 5.25,
      dividendYield: 0.016
    },
    riskMetrics: {
      volatility: 0.30,
      beta: 1.3,
      sharpeRatio: 0.9,
      valueAtRisk: 0.09,
      maxDrawdown: 0.40
    },
    historicalData: {
      prices: [98.30, 97.20, 96.50, 95.50],
      volumes: [8200000, 8300000, 8400000, 8500000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    currentPrice: 178.75,
    priceChange: -2.50,
    priceChangePercent: -1.38,
    isUp: false,
    volume: 45000000,
    marketCap: 1840000000000,
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.',
    fundamentalData: {
      marketCap: 1840000000000,
      peRatio: 62.3,
      eps: 2.87,
      dividendYield: 0
    },
    riskMetrics: {
      volatility: 0.28,
      beta: 1.1,
      sharpeRatio: 1.2,
      valueAtRisk: 0.18,
      maxDrawdown: 0.35
    },
    historicalData: {
      prices: [180.50, 179.80, 179.20, 178.75],
      volumes: [44000000, 44500000, 44800000, 45000000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    currentPrice: 142.65,
    priceChange: 1.85,
    priceChangePercent: 1.31,
    isUp: true,
    volume: 25000000,
    marketCap: 1790000000000,
    description: 'Alphabet Inc. provides various products and platforms, including search, advertising, commerce, and cloud computing.',
    fundamentalData: {
      marketCap: 1790000000000,
      peRatio: 25.8,
      eps: 5.53,
      dividendYield: 0
    },
    riskMetrics: {
      volatility: 0.24,
      beta: 1.05,
      sharpeRatio: 1.4,
      valueAtRisk: 0.14,
      maxDrawdown: 0.28
    },
    historicalData: {
      prices: [140.20, 141.30, 142.10, 142.65],
      volumes: [24000000, 24500000, 24800000, 25000000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    currentPrice: 474.99,
    priceChange: 8.75,
    priceChangePercent: 1.88,
    isUp: true,
    volume: 15000000,
    marketCap: 1210000000000,
    description: 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and in-home devices worldwide.',
    fundamentalData: {
      marketCap: 1210000000000,
      peRatio: 32.5,
      eps: 14.62,
      dividendYield: 0
    },
    riskMetrics: {
      volatility: 0.32,
      beta: 1.3,
      sharpeRatio: 1.6,
      valueAtRisk: 0.2,
      maxDrawdown: 0.4
    },
    historicalData: {
      prices: [460.50, 465.80, 470.20, 474.99],
      volumes: [14500000, 14800000, 14900000, 15000000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    currentPrice: 950.02,
    priceChange: 15.75,
    priceChangePercent: 1.69,
    isUp: true,
    volume: 35000000,
    marketCap: 2340000000000,
    description: 'NVIDIA Corporation designs, develops, and manufactures graphics processing units (GPUs) for the gaming, professional visualization, data center, and automotive markets.',
    fundamentalData: {
      marketCap: 2340000000000,
      peRatio: 75.2,
      eps: 12.63,
      dividendYield: 0.001
    },
    riskMetrics: {
      volatility: 0.35,
      beta: 1.4,
      sharpeRatio: 1.9,
      valueAtRisk: 0.22,
      maxDrawdown: 0.45
    },
    historicalData: {
      prices: [900.50, 920.30, 935.80, 950.02],
      volumes: [34000000, 34500000, 34800000, 35000000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    industry: 'Drug Manufacturers',
    currentPrice: 152.05,
    priceChange: -0.85,
    priceChangePercent: -0.56,
    isUp: false,
    volume: 6500000,
    marketCap: 367000000000,
    description: 'Johnson & Johnson researches, develops, manufactures, and sells various products in the healthcare field worldwide.',
    fundamentalData: {
      marketCap: 367000000000,
      peRatio: 15.8,
      eps: 9.62,
      dividendYield: 0.032
    },
    riskMetrics: {
      volatility: 0.18,
      beta: 0.7,
      sharpeRatio: 1.1,
      valueAtRisk: 0.1,
      maxDrawdown: 0.2
    },
    historicalData: {
      prices: [155.20, 154.30, 153.20, 152.05],
      volumes: [6300000, 6400000, 6450000, 6500000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    industry: 'Banks',
    currentPrice: 182.63,
    priceChange: 2.15,
    priceChangePercent: 1.19,
    isUp: true,
    volume: 8500000,
    marketCap: 526000000000,
    description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.',
    fundamentalData: {
      marketCap: 526000000000,
      peRatio: 13.2,
      eps: 13.84,
      dividendYield: 0.025
    },
    riskMetrics: {
      volatility: 0.22,
      beta: 1.1,
      sharpeRatio: 1.3,
      valueAtRisk: 0.15,
      maxDrawdown: 0.3
    },
    historicalData: {
      prices: [180.50, 181.20, 181.90, 182.63],
      volumes: [8300000, 8400000, 8450000, 8500000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble Co.',
    sector: 'Consumer Staples',
    industry: 'Household & Personal Products',
    currentPrice: 156.84,
    priceChange: 0.95,
    priceChangePercent: 0.61,
    isUp: true,
    volume: 5500000,
    marketCap: 370000000000,
    description: 'The Procter & Gamble Company provides branded consumer packaged goods to consumers through mass merchandisers, e-commerce, grocery stores, membership club stores, and drug stores.',
    fundamentalData: {
      marketCap: 370000000000,
      peRatio: 24.5,
      eps: 6.40,
      dividendYield: 0.028
    },
    riskMetrics: {
      volatility: 0.15,
      beta: 0.5,
      sharpeRatio: 0.9,
      valueAtRisk: 0.08,
      maxDrawdown: 0.15
    },
    historicalData: {
      prices: [155.50, 156.10, 156.50, 156.84],
      volumes: [5400000, 5450000, 5480000, 5500000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    sector: 'Energy',
    industry: 'Oil & Gas Integrated',
    currentPrice: 115.24,
    priceChange: 1.85,
    priceChangePercent: 1.63,
    isUp: true,
    volume: 8500000,
    marketCap: 460000000000,
    description: 'Exxon Mobil Corporation explores for and produces crude oil and natural gas in the United States and internationally.',
    fundamentalData: {
      marketCap: 460000000000,
      peRatio: 12.8,
      eps: 9.00,
      dividendYield: 0.035
    },
    riskMetrics: {
      volatility: 0.2,
      beta: 1.2,
      sharpeRatio: 1.1,
      valueAtRisk: 0.12,
      maxDrawdown: 0.25
    },
    historicalData: {
      prices: [113.50, 114.20, 114.80, 115.24],
      volumes: [8300000, 8400000, 8450000, 8500000],
      timestamps: [1625097600, 1625184000, 1625270400, 1625356800]
    },
    lastUpdated: new Date()
  }
];

module.exports = sampleStocks; 