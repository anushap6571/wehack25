const express = require('express');
//import the connection 
const { connectToDatabase } = require('./db');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

//calls connection function to connect to database 
connectToDatabase(); 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
