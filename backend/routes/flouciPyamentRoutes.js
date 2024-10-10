const express = require('express');
const router = express.Router();
const flouciPaymentController = require('../controllers/flouciPaymentController');

// Route to initiate payment
router.post('/payment', flouciPaymentController.Add);

// Route to confirm payment (after client redirects)
router.get('/confirm/:id', flouciPaymentController.Verify);

module.exports = router;
