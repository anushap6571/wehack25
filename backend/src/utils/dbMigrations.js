/*const mongoose = require('mongoose');
const Stock = require('../models/stock.model');

async function addLikedFieldMigration() {
    try {
        const result = await Stock.updateMany(
            { liked: { $exists: false } },  // Find stocks without 'liked' field
            { $set: { liked: false } }      // Set them to false
        );
        console.log(`Updated ${result.modifiedCount} stocks with liked field`);
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

module.exports = { addLikedFieldMigration }; */