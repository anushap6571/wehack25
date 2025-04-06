const axios = require('axios');

axios.get('http://localhost:3000/api/sp500/top')
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });