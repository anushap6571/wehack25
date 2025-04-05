const Stock = require('../models/stock.model');
const stockScraperService = require('./stockScraper.service');

class StockService {
    async searchStocks(query) {
        try {
            const stocks = await Stock.find({
                $or: [
                    { symbol: { $regex: query, $options: 'i' } },
                    { companyName: { $regex: query, $options: 'i' } }
                ]
            }).limit(10);

            // Update each stock with fresh data
            const updatedStocks = await Promise.all(
                stocks.map(async (stock) => {
                    try {
                        return await stockScraperService.fetchStockData(stock.symbol);
                    } catch (error) {
                        console.error(`Error updating ${stock.symbol}:`, error);
                        return stock;
                    }
                })
            );

            return updatedStocks;
        } catch (error) {
            console.error('Error searching stocks:', error);
            throw error;
        }
    }

    async getStocksBySector(sector) {
        try {
            const stocks = await Stock.find(
                { sector: { $regex: new RegExp(sector, 'i') } },
                'symbol companyName sector industry currentPrice'
            );

            // Update each stock with fresh data
            const updatedStocks = await Promise.all(
                stocks.map(async (stock) => {
                    try {
                        return await stockScraperService.fetchStockData(stock.symbol);
                    } catch (error) {
                        console.error(`Error updating ${stock.symbol}:`, error);
                        return stock;
                    }
                })
            );

            return {
                success: true,
                count: updatedStocks.length,
                data: updatedStocks
            };
        } catch (error) {
            console.error('Error fetching stocks by sector:', error);
            throw error;
        }
    }

    async fetchStockData(symbol) {
        try {
            return await stockScraperService.fetchStockData(symbol);
        } catch (error) {
            console.error(`Error fetching stock data for ${symbol}:`, error);
            throw error;
        }
    }
}

module.exports = new StockService(); 