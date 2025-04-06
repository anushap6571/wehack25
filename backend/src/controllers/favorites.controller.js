const User = require('../models/User');

const favoritesController = {
    // Toggle favorite status
    async toggleFavorite(req, res) {
        try {
            const userId = req.user.userId; 
            const { symbol } = req.params;  // Get stock symbol from URL

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Check if stock is already in favorites
            const favoriteIndex = user.favorites.indexOf(symbol);
            
            if (favoriteIndex === -1) {
                // Add to favorites if not already there
                user.favorites.push(symbol);
            } else {
                // Remove from favorites if already there
                user.favorites.splice(favoriteIndex, 1);
            }

            await user.save();

            res.json({
                success: true,
                isFavorited: favoriteIndex === -1, // true if just added, false if just removed
                favorites: user.favorites
            });

        } catch (error) {
            console.error('Error toggling favorite:', error);
            res.status(500).json({ error: 'Failed to toggle favorite' });
        }
    },

    // Get user's favorites
    async getFavorites(req, res) {
        try {
            const userId = req.user.userId; 
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                success: true,
                favorites: user.favorites
            });

        } catch (error) {
            console.error('Error getting favorites:', error);
            res.status(500).json({ error: 'Failed to get favorites' });
        }
    }
};

module.exports = favoritesController;