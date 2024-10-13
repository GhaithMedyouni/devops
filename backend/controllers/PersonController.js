const Person = require('../models/appmodel/Person');

// Create a new person
exports.createPerson = async (req, res) => {
    const { prenom, nom, entreprise, pays, telephone, email,cin,createdBy} = req.body;

    const newPerson = new Person({
        prenom,
        nom,
        entreprise,
        pays,
        telephone,
        email,
        cin,
        createdBy
    });

    try {
        await newPerson.save();
        res.status(201).json(newPerson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all people
exports.getAllPeople = async (req, res) => {
    try {
        const people = await Person.find();
        res.status(200).json(people);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getAll = async (req, res) => {
    try {
        console.log(req.body.createdBy)
        adminId = req.body.createdBy
        const people = await Person.find({createdBy: adminId});
        res.status(200).json(people);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Get a person by ID
exports.getPersonById = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a person by ID
exports.updatePersonById = async (req, res) => {
    try {
        const person = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!person) {
            return res.status(404).json({ error: 'Person not found' });
        }
        res.status(200).json(person);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a person by ID
exports.deletePersonById = async (req, res) => {
    try {
        const person = await Person.findByIdAndDelete(req.params.id);
        if (!person) {
            return res.status(404).json({ error: 'Person not found' });
        }
        if (person.isClient) return res.status(404).json({ message: 'person is Client can not deleted' });

        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
