const express = require('express');
const router = express.Router();
const depenseController = require('../controllers/depenseController');

// Create a new depense
router.post('/', depenseController.createDepense);

// Get all depenses or filter by createdBy
router.get('/', depenseController.getDepenses);

// Get a single depense by ID
router.get('/:id', depenseController.getDepenseById);

// Update a depense by ID
router.put('/:id', depenseController.updateDepense);

// Delete a depense by ID
router.delete('/:id', depenseController.deleteDepense);

module.exports = router;
