const express = require('express');
const router = express.Router();
const { getCompanyImage } = require('../controllers/image.controller');

router.post('/generate-image', getCompanyImage);

module.exports = router;
