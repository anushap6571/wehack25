const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');
const imageRoutes = require('./src/routes/image.routes');
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('Connected to MongoDB Atlas');
    
    // Initialize scheduled jobs after successful database connection
    initializeScheduledJobs();
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    logger.info('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

// Initialize scheduled jobs
const initializeScheduledJobs = () => {
  try {
    // Import and initialize the stock update job
    const { scheduleStockUpdate } = require('./src/jobs/stockUpdateJob');
    scheduleStockUpdate();
    logger.info('Scheduled jobs initialized successfully');
  } catch (error) {
    logger.error('Error initializing scheduled jobs:', error);
  }
};

connectWithRetry();

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry();
});

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/stocks', require('./src/routes/stock.routes'));
app.use('/api/recommendations', require('./src/routes/recommendation.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use('/api/image', imageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
