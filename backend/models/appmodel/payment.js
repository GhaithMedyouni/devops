const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',  // Reference to the related invoice
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Virement bancaire', 'Espèces', 'Autres'], // Payment methods
    default: 'Autres'
  },
  paymentDate: {
    type: Date,
    default: Date.now  // Defaults to current date when payment is made
  },
  createdBy: {
    type: String, // Change this field to a String instead of a reference to a user
    required: true  // Ensure it's required
  }
}, { timestamps: true }); // timestamps will automatically add createdAt and updatedAt fields

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
