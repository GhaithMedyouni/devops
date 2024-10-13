const Client = require('../models/appmodel/Client');
const Person = require('../models/appmodel/Person');
const Entreprise = require('../models/appmodel/Entreprise');
const Invoice = require('../models/appmodel/Invoice');

// Create a new client
exports.createClient = async (req, res) => {
    const { type, entreprise, person,createdBy } = req.body;

    try {
        const newClient = new Client({
            type,
            entreprise,
            person,
            createdBy
        });

        if (type === 'Entreprise' && entreprise) {
            await Entreprise.findByIdAndUpdate(entreprise, { isClient: true });
        } else if (type === 'Person' && person) {
            await Person.findByIdAndUpdate(person, { isClient: true });
        }

        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error });
    }
};

// Get all clients
exports.getClients = async (req, res) => {
    try {
        //console.log(req.body.createdBy)
        const adminId = req.query.createdBy;
        const clients = await Client.find({createdBy: adminId}).populate('entreprise').populate('person');
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error });
    }
};


exports.getPerson_no_Client = async (req, res) => {
    try {
      //  console.log(req.query.createdBy)
        adminId = req.query.createdBy
        const people = await Person.find({
            isClient:false,
            createdBy: adminId});
        console.log(`Found people: ${JSON.stringify(people)}`);
        res.status(200).json(people);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getEntreprise_no_Client = async (req, res) => {
    try {
       // console.log(req.query.createdBy)
        adminId = req.query.createdBy
        const entreprises = await Entreprise.find({
            createdBy: adminId, 
            isClient:false});
        console.log(`Found people: ${JSON.stringify(entreprises)}`);
        res.status(200).json(entreprises);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findById(id).populate('entreprise').populate('person');
        if (!client) return res.status(404).json({ message: 'Client not found' });

        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client', error });
    }
};

// Update a client by ID
exports.updateClient = async (req, res) => {
    const { id } = req.params;
    const { type, entreprise, person } = req.body;

    try {
        const updatedClient = await Client.findByIdAndUpdate(id, { type, entreprise, person }, { new: true });

        if (!updatedClient) return res.status(404).json({ message: 'Client not found' });

        if (type === 'Entreprise' && entreprise) {
            await Entreprise.findByIdAndUpdate(entreprise, { isClient: true });
        } else if (type === 'Person' && person) {
            await Person.findByIdAndUpdate(person, { isClient: true });
        }

        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
};

// Delete a client by ID
exports.deleteClient = async (req, res) => {
    const { id } = req.params;

    try {
        const cl = await Invoice.find({ client: id });

        if (cl.length > 0) {
          return res.status(400).json({
            message: 'Cannot delete client as it is associated with one or more invoices.'
          });
        }
        const client = await Client.findByIdAndDelete(id);
      
        if (!client) return res.status(404).json({ message: 'Client not found' });

        if (client.type === 'Entreprise' && client.entreprise) {
            await Entreprise.findByIdAndUpdate(client.entreprise, { isClient: false });
        } else if (client.type === 'Person' && client.person) {
            await Person.findByIdAndUpdate(client.person, { isClient: false });
        }

        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error });
    }
};
