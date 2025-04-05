const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { body } = require('express-validator');

// Validation middleware
const validateRecommendationRequest = [
  body('interests')
    .isArray()
    .withMessage('Interests must be an array')
    .notEmpty()
    .withMessage('At least one interest is required'),
  body('riskTolerance')
    .isFloat({ min: 0, max: 1 })
    .withMessage('Risk tolerance must be a number between 0 and 1')
];

const validateInterestCategoriesRequest = [
  body('interests')
    .isArray()
    .withMessage('Interests must be an array')
    .notEmpty()
    .withMessage('At least one interest is required')
    .custom((value) => {
      const validCategories = ['food', 'technology', 'clothes', 'travel', 'sports'];
      return value.every(interest => validCategories.includes(interest));
    })
    .withMessage('Interests must be one or more of: food, technology, clothes, travel, sports')
];

// Get stock recommendations
router.post('/generate', validateRecommendationRequest, recommendationController.getRecommendations);

// Get recommendations based on predefined interest categories
router.post('/interests', validateInterestCategoriesRequest, recommendationController.getInterestBasedRecommendations);

// Get risk analysis for a specific stock
router.get('/risk-analysis/:symbol', recommendationController.getStockRiskAnalysis);

// Update stock data (admin endpoint)
router.post('/update-data', recommendationController.updateStockData);

module.exports = router; 