const mongoose = require('mongoose');

const DepenseCategorySchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  name: {
    type: String,
    required: true,
  },
  description: String,
  color: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  createdBy: {
    type: String,
    required: true
},
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DepenseCategory', DepenseCategorySchema);