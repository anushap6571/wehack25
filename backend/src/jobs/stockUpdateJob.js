const cron = require('node-cron');
const stockController = require('../controllers/stock.controller');

// Schedule the job to run daily at 6 AM
// This will update the stock database with the latest data
const scheduleStockUpdate = () => {
  console.log('Scheduling daily stock database update...');
  
  cron.schedule('0 6 * * *', async () => {
    console.log('Running scheduled stock database update...');
    try {
      const result = await stockController.updateStockDatabase();
      console.log('Scheduled update completed successfully:', result);
    } catch (error) {
      console.error('Error in scheduled stock update:', error);
    }
  });
  
  console.log('Stock update job scheduled successfully');
};

module.exports = {
  scheduleStockUpdate
}; 