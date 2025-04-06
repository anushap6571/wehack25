const { MongoClient } = require('mongodb');
//const { addLikedFieldMigration } = require('../utils/dbMigrations');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    console.log("Running database migrations...");
        //await addLikedFieldMigration();
        console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { connectToDatabase };
