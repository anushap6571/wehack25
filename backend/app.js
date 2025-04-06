const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');
//const likesController = require('./src/controllers/likes.controller');


const imageRoutes = require('./src/routes/image.routes');
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Define PORT early
const PORT = process.env.PORT || 3000;
const chatbot = require('./src/controllers/chatbot');

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

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

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
//app.use('/api/likes', require('./src/routes/likes.routes.js'));
app.use('/api/auth', require('./src/routes/auth.routes.js'));
app.use('/api/stocks', require('./src/routes/stock.routes.js'));
app.use('/api/recommendations', require('./src/routes/recommendation.routes.js'));

// Chatbot endpoint to handle general finance-related questions
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body; // Extract the message from the request body
        if (!message) {
            return res.status(400).json({ error: 'Message is required' }); // Return an error if no message is provided
        }
        
        // Get the response from the chatbot
        const response = await chatbot.getResponse(message); // Call the chatbot's getResponse method
        res.json({ response }); // Return the response as JSON
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return an error if something goes wrong
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use('/api/image', imageRoutes);

//const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});