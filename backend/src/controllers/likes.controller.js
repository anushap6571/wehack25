/*const Stock = require('../models/stock.model');

const likesController = {
    // Toggle like status of a stock
    async toggleLike(req, res) {
        try {
            const { symbol } = req.params;
            
            // Find the stock
            const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
            
            if (!stock) {
                return res.status(404).json({ message: 'Stock not found' });
            }

            // Toggle the liked status
            stock.liked = !stock.liked;
            await stock.save();

            return res.json({ 
                symbol: stock.symbol, 
                liked: stock.liked 
            });
        } catch (error) {
            console.error('Error toggling like:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Get all liked stocks
    async getLikedStocks(req, res) {
        try {
            const likedStocks = await Stock.find({ liked: true });
            return res.json(likedStocks);
        } catch (error) {
            console.error('Error getting liked stocks:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = likesController; */ 