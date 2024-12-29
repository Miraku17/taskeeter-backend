const express = require('express');
const router = express.Router();
const { getQuote } = require('../controllers/quoteController');

router.get('/', getQuote);

module.exports = router;