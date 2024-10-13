const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');

// Create a new entreprise
router.post('/', entrepriseController.createEntreprise);

// Get all entreprises
router.get('/', entrepriseController.getEntreprises);


router.get('/byadmin', entrepriseController.getAllbyadmin);
// Get a single entreprise by ID
router.get('/:id', entrepriseController.getEntrepriseById);

// Update an entreprise by ID
router.put('/:id', entrepriseController.updateEntreprise);

// Delete an entreprise by ID
router.delete('/:id', entrepriseController.deleteEntreprise);

module.exports = router;
