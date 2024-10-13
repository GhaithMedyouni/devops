const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Create a new client
router.post('/', clientController.createClient);

// Get all clients
router.get('/', clientController.getClients);
// get all person no clint
router.get('/person-non-client', clientController.getPerson_no_Client);
// get all entreprise no clint
router.get('/entreprise-non-client', clientController.getEntreprise_no_Client);
// Get a single client by ID
router.get('/:id', clientController.getClientById);
// Update a client by ID
router.put('/:id', clientController.updateClient);

// Delete a client by ID
router.delete('/:id', clientController.deleteClient);

module.exports = router;
