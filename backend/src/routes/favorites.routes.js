const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Toggle favorite status
router.post('/:symbol/toggle', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { symbol } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Initialize favorites array if it doesn't exist
        if (!user.favorites) {
            user.favorites = [];
        }

        // Check if stock is already in favorites
        const favoriteIndex = user.favorites.indexOf(symbol);
        
        if (favoriteIndex === -1) {
            // Add to favorites
            user.favorites.push(symbol);
        } else {
            // Remove from favorites
            user.favorites.splice(favoriteIndex, 1);
        }

        await user.save();

        res.json({
            success: true,
            isFavorited: favoriteIndex === -1,
            favorites: user.favorites
        });

    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ error: 'Failed to toggle favorite' });
    }
});

// Get user's favorites
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            favorites: user.favorites || []
        });

    } catch (error) {
        console.error('Error getting favorites:', error);
        res.status(500).json({ error: 'Failed to get favorites' });
    }
});

module.exports = router;