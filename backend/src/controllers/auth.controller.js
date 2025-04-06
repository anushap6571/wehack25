const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

class AuthController {
  // Register a new user
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, interests, riskTolerance } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if (existingUser) {
        return res.status(400).json({ 
          error: 'User with this email or username already exists' 
        });
      }

      // Create new user
      const user = new User({
        username,
        email,
        password,
        interests: interests || [],
        riskTolerance: riskTolerance || 0.5
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          interests: user.interests,
          riskTolerance: user.riskTolerance
        }
      });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to register user'
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          interests: user.interests,
          riskTolerance: user.riskTolerance
        }
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {

      const user = await User.findById(req.user.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile'
      });
    }
  }

  // Update user preferences
  async updatePreferences(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { interests, maxPrice } = req.body;
      
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user preferences
      user.interests = interests;
      user.maxStockPrice = maxPrice;

      await user.save();

      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          interests: user.interests,
          maxStockPrice: user.maxStockPrice
        }
      });
    } catch (error) {
      console.error('Error in updatePreferences:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update preferences'
      });
    }
  }

  async saveUserInterests(req, res) {
    const { interests, maxPrice, minPrice } = req.body;
    const userId = req.user.userId; 
    const user = await User.findById(userId);
    try {
      if (user) {
          user.interests = interests;
          user.maxStockPrice = maxPrice;
          await user.save();
      }
    } catch (userError) {
      console.error('Error saving user interests:', userError);
    }
    res.json({ success: true });
  }

  async getUserInterests(req, res) {
    const userId = req.user.userId; 
    const user = await User.findById(userId);
    res.json({
      interests: user.interests,
      maxStockPrice: user.maxStockPrice
    });
  }


}



module.exports = new AuthController(); 