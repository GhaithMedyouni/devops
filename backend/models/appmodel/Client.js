const mongoose = require('mongoose');

// Define the schema for the form data
const clientSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Company', 'Person'] // Assuming there might be another type like 'Individuel'
  },
  entreprise: { type: mongoose.Schema.ObjectId, ref: 'Entreprise', autopopulate: true },
  person: { type: mongoose.Schema.ObjectId, ref: 'Person', autopopulate: true },
  createdBy: {
    type: String,
    required: true
},
created: {
    type: Date,
    default: Date.now,
  },
});
clientSchema.plugin(require('mongoose-autopopulate'));

// Create and export the model
const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
