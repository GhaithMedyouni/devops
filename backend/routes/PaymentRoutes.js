const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create a payment
router.post('/invoice/:invoiceId', paymentController.createPayment);
// Get all Payments
router.get('/createdBy/:createdBy', paymentController.getAllPaymentsByCreatedBy );
// Route to get all payments for a specific invoice
router.get('/invoice/:invoiceId', paymentController.getPaymentsForInvoice);
// Get payment by id
router.get('/:id', paymentController.getPaymentById);

// Update Payment
router.put('/:id', paymentController.updatePayment);
// Delete Payment
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
