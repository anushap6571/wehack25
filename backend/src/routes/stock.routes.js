const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/search', stockController.searchStocks);
router.get('/sector/:sector', stockController.getStocksBySector);
router.get('/:symbol', stockController.getStockData);

// Protected routes
router.post('/recommendations', auth, stockController.getStockRecommendations.bind(stockController));
router.post('/update-database', auth, stockController.updateStockDatabase.bind(stockController));

module.exports = router; 