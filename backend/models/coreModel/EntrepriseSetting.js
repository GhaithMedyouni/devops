const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'], // Basic email validation
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  taxNumber: {
    type: String,
    required: true,
  },
  vatNumber: {
    type: String,
    required: true,
  },
  registrationNumber: {
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
  logo: {
    type: String,
    required: false,
    default:null
  },
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
