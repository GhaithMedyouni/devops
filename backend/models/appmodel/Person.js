const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    prenom: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
      },
    entreprise: { type: mongoose.Schema.ObjectId, ref: 'Entreprise', autopopulate: true },
    isClient: {
        type: Boolean,
        default: false,
      },
    pays: String,
    telephone: String,
    email: String,
    cin: String

});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
