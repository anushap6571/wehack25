const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const validateRegistration = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('riskTolerance')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Risk tolerance must be a number between 0 and 1')
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validatePreferences = [
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('riskTolerance')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Risk tolerance must be a number between 0 and 1')
];

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/preferences', authMiddleware, validatePreferences, authController.updatePreferences);
router.post('/saveUserInterests', authMiddleware, authController.saveUserInterests.bind(authController));
router.get('/getUserInterests', authMiddleware, authController.getUserInterests.bind(authController));

module.exports = router; 