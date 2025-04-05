const mongoose = require('mongoose');
const Stock = require('../models/stock.model');
const sampleStocks = require('./sampleStocks');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockapp';
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

// Seed the database with sample stocks
const seedDatabase = async () => {
    try {
        // Clear existing stocks
        await Stock.deleteMany({});
        console.log('Cleared existing stocks');

        // Insert sample stocks
        const result = await Stock.insertMany(sampleStocks);
        console.log(`Successfully seeded ${result.length} stocks`);

        // Log stocks by sector
        const stocksBySector = {};
        result.forEach(stock => {
            if (!stocksBySector[stock.sector]) {
                stocksBySector[stock.sector] = [];
            }
            stocksBySector[stock.sector].push(stock.symbol);
        });

        console.log('\nStocks by sector:');
        Object.entries(stocksBySector).forEach(([sector, symbols]) => {
            console.log(`${sector}: ${symbols.join(', ')}`);
        });

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seeding process
connectDB()
    .then(() => seedDatabase())
    .catch(err => {
        console.error('Error in seeding process:', err);
        process.exit(1);
    }); 