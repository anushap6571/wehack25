const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.DB_URI;


const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { connectToDatabase };
