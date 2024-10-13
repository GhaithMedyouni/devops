const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');


// Create a new invoice
router.post('/',invoiceController.uploadFac.single('factureImage'), invoiceController.createInvoice);

// Get all invoices with optional filtering
// /api/invoices/60c72b2f9b1e8b001f3b1d3c
// GET /api/invoices/60c72b2f9b1e8b001f3b1d3c?type=Standard&status=Brouillon
router.get('/:createdBy', invoiceController.getInvoices);

// Convert Proforma to Facture
router.post('/convert-to-facture/:id', invoiceController.convertProformaToFacture);

// Update an existing invoice
router.put('/invoices/:id', invoiceController.uploadFac.single('factureImage'), invoiceController.updateInvoice);

// Delete an invoice
router.delete('/:id', invoiceController.deleteInvoice);
// Route to update payment status
router.post('/pay/:id', invoiceController.updatePaymentStatus);
// Route to get an invoice by its ID
router.get('/getbyid/:id', invoiceController.getInvoiceById);
// Route to generate PDF for an invoice
router.get('/export-pdf/:id/:createdBy', invoiceController.generateInvoicePDF);
router.get('/export-multi/pdf', invoiceController.generateMultipleInvoicesZip);
//Route to gernate pdf for invoice and send it par email
router.get('/export-pdf/send-email/:id/:createdBy', invoiceController.generateInvoicePDFandSendEmail);

module.exports = router;
