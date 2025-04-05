const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const cheerio = require('cheerio');

puppeteer.use(StealthPlugin());

class StockScraperService {
  constructor() {
    this.baseUrl = 'https://finance.yahoo.com/quote/';
  }

  async fetchStockData(symbol) {
    console.log(`Launching browser to fetch ${symbol}...`);

    const browser = await puppeteer.launch({
      headless: 'new', // Or true, depending on Puppeteer version
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      const url = `${this.baseUrl}${symbol}`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

      const html = await page.content();
      console.log(`Fetched page for ${symbol}. Parsing...`);

      const stockData = this.parseStockData(html, symbol);
      return stockData;
    } catch (error) {
      console.error(`Puppeteer error for ${symbol}:`, error.message);
      throw error;
    } finally {
      await browser.close();
    }
  }

  parseStockData(html, symbol) {
    const $ = cheerio.load(html);

    const companyName = $('h1[data-reactid="7"]').text().split('(')[0].trim() || symbol;
    const currentPrice = this.parsePrice($('fin-streamer[data-field="regularMarketPrice"]').text()) || 0;

    const sector = $('td:contains("Sector")').next().text().trim() || 'Unknown';
    const industry = $('td:contains("Industry")').next().text().trim() || 'Unknown';

    const marketCap = this.parseMarketCap($('td:contains("Market Cap")').next().text()) || 0;
    const peRatio = this.parseFloat($('td:contains("PE Ratio")').next().text()) || 0;
    const eps = this.parseFloat($('td:contains("EPS")').next().text()) || 0;
    const dividendYield = this.parsePercentage($('td:contains("Dividend Yield")').next().text()) || 0;
    const beta = this.parseFloat($('td:contains("Beta")').next().text()) || 0;

    return {
      symbol,
      companyName,
      sector,
      industry,
      currentPrice,
      riskMetrics: {
        volatility: 0,
        beta: beta,
        sharpeRatio: 0,
        valueAtRisk: 0,
        maxDrawdown: 0
      },
      technicalIndicators: {
        rsi: 0,
        macd: { value: 0, signal: 0, histogram: 0 },
        movingAverages: { sma50: 0, sma200: 0 }
      },
      fundamentalData: {
        marketCap,
        peRatio,
        dividendYield,
        debtToEquity: 0
      },
      lastUpdated: new Date()
    };
  }

  // Helper methods
  parsePrice(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/,/g, ''));
  }

  parseMarketCap(str) {
    if (!str) return 0;
    const val = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (str.includes('T')) return val * 1e12;
    if (str.includes('B')) return val * 1e9;
    if (str.includes('M')) return val * 1e6;
    return val;
  }

  parseFloat(value) {
    if (!value) return 0;
    return parseFloat(value.replace(/,/g, ''));
  }

  parsePercentage(str) {
    if (!str) return 0;
    return parseFloat(str.replace('%', '')) / 100;
  }

  // Optional stubbed methods
  async calculateRiskMetrics(symbol) {
    return {
      volatility: 0,
      beta: 0,
      sharpeRatio: 0,
      valueAtRisk: 0,
      maxDrawdown: 0
    };
  }

  async getTechnicalIndicators(symbol) {
    return {
      rsi: 0,
      macd: { value: 0, signal: 0, histogram: 0 },
      movingAverages: { sma50: 0, sma200: 0 }
    };
  }
}

module.exports = new StockScraperService();















// const axios = require('axios');
// const cheerio = require('cheerio');
// const https = require('https');
// const http = require('http');

// class StockScraperService {
//   constructor() {
//     this.baseUrl = 'https://finance.yahoo.com/quote/';
//     // Create a custom HTTPS agent with increased header size
//     this.httpsAgent = new https.Agent({
//       maxHeaderSize: 65536, // Increase from 32768 to 65536
//       keepAlive: true
//     });
//   }

//   async fetchStockData(symbol) {
//     try {
//       console.log(`Scraping data for ${symbol} from Yahoo Finance`);
      
//       // Try using axios with custom agent first
//       try {
//         console.log(`Attempting to fetch ${symbol} with Axios...`);
//         const response = await axios.get(`${this.baseUrl}${symbol}`, {
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//           },
//           httpsAgent: this.httpsAgent,
//           timeout: 15000 // 15 second timeout
//         });
        
//         console.log(`Successfully fetched ${symbol} with Axios`);
//         return this.parseStockData(response.data, symbol);
//       } catch (axiosError) {
//         console.error(`Axios error for ${symbol}:`, axiosError.message);
        
//         // If axios fails, try using node's native https module
//         console.log(`Falling back to native HTTPS for ${symbol}...`);
//         return this.fetchWithNativeHttps(symbol);
//       }
//     } catch (error) {
//       console.error(`Error fetching data for ${symbol}:`, error.message);
//       throw error;
//     }
//   }
  
//   // Fallback method using native https module
//   async fetchWithNativeHttps(symbol) {
//     return new Promise((resolve, reject) => {
//       console.log(`Setting up native HTTPS request for ${symbol}...`);
      
//       // Function to make the actual request
//       const makeRequest = (url, redirectCount = 0) => {

//         if (redirectCount > 5) {
//           return reject(new Error(`Too many redirects for ${symbol}`));
//         }

//         const options = {
//           hostname: url.hostname,
//           path: url.pathname + url.search,
//           maxHeaderSize: 65536,
//           method: 'GET',
//           headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//           }
//         };
        
//         console.log(`Making request to: ${url.hostname}${url.pathname}${url.search}`);
        
//         const req = https.request(options, (res) => {
//         console.log(`Native HTTPS response received for ${symbol}, status: ${res.statusCode}`);
          
//           // Handle redirects
//           if (res.statusCode === 301 || res.statusCode === 302) {
//             const location = res.headers.location;
//             console.log(`Redirecting to: ${location}`);
            
//             // Parse the redirect URL
//             //const redirectUrl = new URL(location);
//             const redirectUrl = new URL(location, url.origin);
//             makeRequest(redirectUrl, redirectCount + 1);
            
//             // Make a new request to the redirect URL
//             //makeRequest(redirectUrl);

            
//             return;
//           }
          
//           let data = '';
          
//           res.on('data', (chunk) => {
//             data += chunk;
//           });
          
//           res.on('end', () => {
//             try {
//               console.log(`Successfully fetched ${symbol} with native HTTPS`);
//               const stockData = this.parseStockData(data, symbol);
//               resolve(stockData);
//             } catch (error) {
//               console.error(`Error parsing data for ${symbol}:`, error.message);
//               reject(error);
//             }
//           });
//         });
        
//         req.on('error', (error) => {
//           console.error(`Native HTTPS error for ${symbol}:`, error.message);
//           reject(error);
//         });
        
//         req.end();
//       };
      
//       // Start with the initial URL
//       const initialUrl = new URL(`${this.baseUrl}${symbol}`);
//       makeRequest(initialUrl);
//     });
//   }
  
//   // Parse the HTML data to extract stock information
//   parseStockData(html, symbol) {
//     const $ = cheerio.load(html);
    
//     // Extract basic stock information
//     const companyName = $('h1[data-reactid="7"]').text().split('(')[0].trim() || symbol;
//     const currentPrice = this.parsePrice($('span[data-reactid="32"]').text()) || 0;
    
//     // Extract sector and industry
//     const sector = $('td:contains("Sector")').next().text().trim() || 'Unknown';
//     const industry = $('td:contains("Industry")').next().text().trim() || 'Unknown';
    
//     // Extract fundamental data
//     const marketCap = this.parseMarketCap($('td:contains("Market Cap")').next().text()) || 0;
//     const peRatio = this.parseFloat($('td:contains("PE Ratio")').next().text()) || 0;
//     const eps = this.parseFloat($('td:contains("EPS")').next().text()) || 0;
//     const dividendYield = this.parsePercentage($('td:contains("Dividend Yield")').next().text()) || 0;
//     const beta = this.parseFloat($('td:contains("Beta")').next().text()) || 0;
    
//     // Create a simplified risk metrics object
//     const riskMetrics = {
//       volatility: 0,
//       beta: beta,
//       sharpeRatio: 0,
//       valueAtRisk: 0,
//       maxDrawdown: 0
//     };
    
//     // Create a simplified technical indicators object
//     const technicalIndicators = {
//       rsi: 0,
//       macd: {
//         value: 0,
//         signal: 0,
//         histogram: 0
//       },
//       movingAverages: {
//         sma50: 0,
//         sma200: 0
//       }
//     };
    
//     // Create a simplified fundamental data object
//     const fundamentalData = {
//       marketCap: marketCap,
//       peRatio: peRatio,
//       dividendYield: dividendYield,
//       debtToEquity: 0
//     };
    
//     // Return the stock data
//     return {
//       symbol,
//       companyName,
//       sector,
//       industry,
//       currentPrice,
//       riskMetrics,
//       technicalIndicators,
//       fundamentalData,
//       lastUpdated: new Date()
//     };
//   }
  
//   // Helper methods for parsing values
//   parsePrice(priceStr) {
//     if (!priceStr) return 0;
//     return parseFloat(priceStr.replace(/,/g, ''));
//   }
  
//   parseMarketCap(marketCapStr) {
//     if (!marketCapStr) return 0;
//     const value = parseFloat(marketCapStr.replace(/[^0-9.]/g, ''));
//     if (marketCapStr.includes('T')) return value * 1000000000000;
//     if (marketCapStr.includes('B')) return value * 1000000000;
//     if (marketCapStr.includes('M')) return value * 1000000;
//     return value;
//   }
  
//   parseFloat(value) {
//     if (!value) return 0;
//     return parseFloat(value.replace(/,/g, ''));
//   }
  
//   parsePercentage(percentageStr) {
//     if (!percentageStr) return 0;
//     return parseFloat(percentageStr.replace(/%/g, '')) / 100;
//   }
  
//   // These methods are stubs for the original implementation
//   async calculateRiskMetrics(symbol) {
//     // Simplified implementation
//     return {
//       volatility: 0,
//       beta: 0,
//       sharpeRatio: 0,
//       valueAtRisk: 0,
//       maxDrawdown: 0
//     };
//   }
  
//   async getTechnicalIndicators(symbol) {
//     // Simplified implementation
//     return {
//       rsi: 0,
//       macd: {
//         value: 0,
//         signal: 0,
//         histogram: 0
//       },
//       movingAverages: {
//         sma50: 0,
//         sma200: 0
//       }
//     };
//   }
// }

// module.exports = new StockScraperService(); 