const Entreprise = require('../models/appmodel/Entreprise');

// Create a new entreprise
exports.createEntreprise = async (req, res) => {
  const { nom, mainContact, pays, telephone, email, siteweb,rib,fisc,createdBy } = req.body;

  try {
    const newEntreprise = new Entreprise({
      nom,
      mainContact,
      pays,
      telephone,
      email,
      siteweb,
      rib,
      fisc,
      createdBy
    });

    const savedEntreprise = await newEntreprise.save();
    res.status(201).json(savedEntreprise);
  } catch (error) {
    res.status(500).json({ message: 'Error creating entreprise', error });
  }
};

// Get all entreprises
exports.getEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find().populate('mainContact');
    res.status(200).json(entreprises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entreprises', error });
  }
};
exports.getAllbyadmin = async (req, res) => {
    try {
        console.log(req.body.createdBy)
        adminId=req.body.createdBy
        const entreprises = await Entreprise.find({createdBy: adminId});
        res.status(200).json(entreprises);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get a single entreprise by ID
exports.getEntrepriseById = async (req, res) => {
  const { id } = req.params;

  try {
    const entreprise = await Entreprise.findById(id).populate('mainContact');
    if (!entreprise) return res.status(404).json({ message: 'Entreprise not found' });

    res.status(200).json(entreprise);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entreprise', error});
  }
};

// Update an entreprise by ID
exports.updateEntreprise = async (req, res) => {
  const { id } = req.params;
  const { nom, mainContact, pays, telephone, email, siteweb } = req.body;

  try {
    const updatedEntreprise = await Entreprise.findByIdAndUpdate(
      id,
      { nom, mainContact, pays, telephone, email, siteweb },
      { new: true }
    );

    if (!updatedEntreprise) return res.status(404).json({ message: 'Entreprise not found' });

    res.status(200).json(updatedEntreprise);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entreprise', error });
  }
};

// Delete an entreprise by ID
exports.deleteEntreprise = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntreprise = await Entreprise.findByIdAndDelete(id);
    if (!deletedEntreprise) return res.status(404).json({ message: 'Entreprise not found' });
    if (deletedEntreprise.isClient) return res.status(404).json({ message: 'Entreprise is Client can not deleted' });
    res.status(200).json({ message: 'Entreprise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entreprise', error });
  }
};
