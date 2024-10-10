const express = require('express');
const router = express.Router();
const taxController = require('../controllers/TaxesControllers');

// Create a new tax
router.post('/', taxController.createTax);

// Get all taxes or filter by createdBy
router.get('/', taxController.getTaxes);

// Get a single tax by ID
router.get('/:id', taxController.getTaxById);

// Update a tax by ID
router.put('/:id', taxController.updateTax);

// Delete a tax by ID
router.delete('/:id', taxController.deleteTax);

module.exports = router;
