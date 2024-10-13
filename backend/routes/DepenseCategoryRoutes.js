const express = require('express');
const router = express.Router();
const depenseCategoryController = require('../controllers/DepenseCategoryController');

// Create a new depense category
router.post('/', depenseCategoryController.createDepenseCategory);

// Get all depense categories
router.get('/', depenseCategoryController.getDepenseCategories);

// Get a single depense category by ID
router.get('/:id', depenseCategoryController.getDepenseCategoryById);

// Update a depense category by ID
router.put('/:id', depenseCategoryController.updateDepenseCategory);

// Delete a depense category by ID
router.delete('/:id', depenseCategoryController.deleteDepenseCategory);

module.exports = router;
