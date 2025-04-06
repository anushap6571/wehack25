const express = require('express');
const router = express.Router();
const { getTopSP500 } = require('../controllers/sp500.controller');

router.get('/top', getTopSP500);

module.exports = router;
