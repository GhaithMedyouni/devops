const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

// Create a new currency
router.post('/', currencyController.createCurrency);

// Get all currencies
router.get('/', currencyController.getCurrencies);

// Get a single currency by ID
router.get('/:id', currencyController.getCurrencyById);

// Update a currency by ID
router.put('/:id', currencyController.updateCurrency);

// Delete a currency by ID
router.delete('/:id', currencyController.deleteCurrency);

module.exports = router;
