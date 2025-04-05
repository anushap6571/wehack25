const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stock = require('../models/stock.model');

// Load environment variables
dotenv.config();

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Find all stocks and display their symbols and names
    const stocks = await Stock.find({}, { symbol: 1, name: 1 });
    
    console.log('\nStocks in database:');
    console.log('------------------');
    stocks.forEach(stock => {
      console.log(`${stock.symbol}: ${stock.name}`);
    });

    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkDatabase(); 