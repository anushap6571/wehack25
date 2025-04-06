const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/search', stockController.searchStocks);
router.get('/sector/:sector', stockController.getStocksBySector);

// Protected routes
router.post('/recommendations', auth, stockController.getStockRecommendations.bind(stockController));
router.post('/update-database', auth, stockController.updateStockDatabase.bind(stockController));


// This should be last to prevent it from catching other routes
router.get('/:symbol', stockController.getStockData);

module.exports = router; 