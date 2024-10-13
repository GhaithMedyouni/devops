const mongoose = require('mongoose');

const DepenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  depenseCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'DepenseCategory',
    required: true,
    autopopulate: true,
  },
  createdBy: {
    type: String,
    required: true
},
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR'], // List of allowed currencies
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  reference: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});



const Product = mongoose.model('Depense', DepenseSchema);
module.exports = Product;
