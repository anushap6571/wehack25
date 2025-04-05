const recommendationService = require('../services/recommendation.service');
const { validationResult } = require('express-validator');
const interestMapping = require('../utils/interestMapping');

class RecommendationController {
  // Get stock recommendations based on user interests and risk tolerance
  async getRecommendations(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { interests, riskTolerance } = req.body;

      if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return res.status(400).json({ error: 'Interests array is required' });
      }

      if (typeof riskTolerance !== 'number' || riskTolerance < 0 || riskTolerance > 1) {
        return res.status(400).json({ error: 'Risk tolerance must be a number between 0 and 1' });
      }

      const recommendations = await recommendationService.generateRecommendations(
        interests,
        riskTolerance
      );

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations'
      });
    }
  }

  // Get detailed risk analysis for a specific stock
  async getStockRiskAnalysis(req, res) {
    try {
      const { symbol } = req.params;

      if (!symbol) {
        return res.status(400).json({ error: 'Stock symbol is required' });
      }

      const stock = await recommendationService.getStockWithRiskMetrics(symbol);

      if (!stock) {
        return res.status(404).json({ error: 'Stock not found' });
      }

      res.json({
        success: true,
        data: stock
      });
    } catch (error) {
      console.error('Error in getStockRiskAnalysis:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get stock risk analysis'
      });
    }
  }

  // Update stock data (admin endpoint)
  async updateStockData(req, res) {
    try {
      await recommendationService.updateStockData();

      res.json({
        success: true,
        message: 'Stock data updated successfully'
      });
    } catch (error) {
      console.error('Error in updateStockData:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update stock data'
      });
    }
  }

  // Get recommendations for predefined interest categories
  async getInterestBasedRecommendations(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { interests } = req.body;

      // Validate interests
      if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return res.status(400).json({ error: 'Interests array is required' });
      }

      // Validate that all interests are from the predefined categories
      const validInterests = interests.every(interest => interestMapping[interest]);
      if (!validInterests) {
        return res.status(400).json({ 
          error: 'Invalid interests. Must be one or more of: food, technology, clothes, travel, sports' 
        });
      }

      // Convert interests to sectors and industries
      const sectorsAndIndustries = interests.reduce((acc, interest) => {
        const mapping = interestMapping[interest];
        acc.sectors.push(...mapping.sectors);
        acc.industries.push(...mapping.industries);
        return acc;
      }, { sectors: [], industries: [] });

      // Get recommendations using the sectors and industries
      const recommendations = await recommendationService.generateRecommendations(
        [...new Set([...sectorsAndIndustries.sectors, ...sectorsAndIndustries.industries])],
        0.5 // Default risk tolerance
      );

      // Format the response
      const formattedRecommendations = recommendations.map(rec => ({
        stockName: rec.companyName,
        symbol: rec.symbol,
        riskScore: this.calculateOverallRiskScore(rec.riskMetrics),
        sector: rec.sector,
        industry: rec.industry
      }));

      res.json({
        success: true,
        data: formattedRecommendations
      });
    } catch (error) {
      console.error('Error in getInterestBasedRecommendations:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate recommendations'
      });
    }
  }

  // Calculate overall risk score from individual metrics
  calculateOverallRiskScore(riskMetrics) {
    const {
      volatility,
      beta,
      sharpeRatio,
      valueAtRisk,
      maxDrawdown
    } = riskMetrics;

    // Normalize each metric to 0-1 scale (higher number = higher risk)
    const normalizedVolatility = Math.min(volatility / 0.5, 1);
    const normalizedBeta = Math.min(Math.abs(beta) / 2, 1);
    const normalizedVaR = Math.min(valueAtRisk / 0.2, 1);
    const normalizedDrawdown = Math.min(maxDrawdown / 0.5, 1);

    // Calculate weighted average (higher weight = more important for risk)
    const weights = {
      volatility: 0.3,
      beta: 0.2,
      sharpeRatio: 0.2,
      valueAtRisk: 0.15,
      maxDrawdown: 0.15
    };

    const riskScore = (
      normalizedVolatility * weights.volatility +
      normalizedBeta * weights.beta +
      (1 - Math.min(sharpeRatio / 2, 1)) * weights.sharpeRatio +
      normalizedVaR * weights.valueAtRisk +
      normalizedDrawdown * weights.maxDrawdown
    );

    // Return risk score as a percentage (0-100)
    return Math.round(riskScore * 100);
  }
}

module.exports = new RecommendationController(); 