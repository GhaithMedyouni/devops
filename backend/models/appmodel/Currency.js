const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  
  createdBy: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;
