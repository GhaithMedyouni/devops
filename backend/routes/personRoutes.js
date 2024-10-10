const express = require('express');
const router = express.Router();
const personController = require('../controllers/PersonController');

// Create a new person
router.post('/', personController.createPerson);
// Get all people
router.get('/', personController.getAllPeople);
router.get('/byadmin', personController.getAll);


// Get a person by ID
router.get('/:id', personController.getPersonById);

// Update a person by ID
router.put('/:id', personController.updatePersonById);

// Delete a person by ID
router.delete('/:id', personController.deletePersonById);

module.exports = router;
