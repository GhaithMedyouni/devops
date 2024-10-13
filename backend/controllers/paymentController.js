const Payment = require('../models/appmodel/payment');
const Invoice = require('../models/appmodel/Invoice');

// Create a new payment for an invoice
exports.createPayment = async (req, res) => {
  try {
    const { amountPaid, paymentMethod,paymentDate, createdBy } = req.body;
    const { invoiceId } = req.params;
    // Find the related invoice
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Create a new payment record
    const payment = new Payment({
      invoice: invoiceId,
      amountPaid,
      paymentMethod,
      paymentDate,
      createdBy  // Save the string value for createdBy
    });

    // Save the payment record
    await payment.save();

    // Update the invoice's paidAmount
    invoice.paidAmount += amountPaid;
    if (invoice.paidAmount >= invoice.total) {
      invoice.paymentStatus = 'Payé';  // Mark the invoice as fully paid
    }
    else {
      invoice.paymentStatus = 'Partiellement payé';  // Mark the invoice as partially paid
    }
   
    await invoice.save();

    res.status(201).json({ message: 'Payment recorded successfully', payment });
  } catch (error) {
    res.status(500).json({ message: 'Error recording payment', error });
  }
};
// Get payment history for an invoice
exports.getPaymentsForInvoice = async (req, res) => {
    try {
      const { invoiceId } = req.params;
  
      // Find all payments related to the invoice
      const payments = await Payment.find({ invoice: invoiceId });
  
      if (!payments || payments.length === 0) {
        return res.status(404).json({ message: 'No payments found for this invoice' });
      }
  
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching payment history', error });
    }
  };

  exports.updatePayment = async (req, res) => {
    try {
      const { amount, method, status } = req.body;
      const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        { amount, method, status },
        { new: true }
      );
      if (!payment) return res.status(404).json({ message: 'Payment not found' });
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ message: 'Error updating payment', error });
    }
  };
  
  // Delete a Payment
  exports.deletePayment = async (req, res) => {
    try {
      const payment = await Payment.findByIdAndDelete(req.params.id);
      if (!payment) return res.status(404).json({ message: 'Payment not found' });
      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting payment', error });
    }
  };

// Get all payments by createdBy
exports.getAllPaymentsByCreatedBy = async (req, res) => {
  try {
    const { createdBy } = req.params;
    const payments = await Payment.find({ createdBy })
      .exec();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};
// Get a payment by paymentId
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id).populate.exec();
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};