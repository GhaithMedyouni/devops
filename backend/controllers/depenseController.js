const Depense = require('../models/appmodel/Depense');

// Create a new depense
exports.createDepense = async (req, res) => {
  const { name, depenseCategory, createdBy, currency, price, description, reference } = req.body;

  try {
    const newDepense = new Depense({
      name,
      depenseCategory,
      createdBy,
      currency,
      price,
      description,
      reference,
    });

    const savedDepense = await newDepense.save();
    res.status(201).json(savedDepense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating depense', error });
  }
};

// Get all depenses or filter by createdBy
exports.getDepenses = async (req, res) => {
  const { createdBy } = req.query;

  try {
    const filter = createdBy ? { createdBy } : {};
    const depenses = await Depense.find(filter).populate('depenseCategory');
    res.status(200).json(depenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching depenses', error });
  }
};

// Get a single depense by ID
exports.getDepenseById = async (req, res) => {
  const { id } = req.params;

  try {
    const depense = await Depense.findById(id);
    if (!depense) return res.status(404).json({ message: 'Depense not found' });

    res.status(200).json(depense);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching depense', error });
  }
};

// Update a depense by ID
exports.updateDepense = async (req, res) => {
  const { id } = req.params;
  const { name, depenseCategory, createdBy, currency, price, description, reference } = req.body;

  try {
    const updatedDepense = await Depense.findByIdAndUpdate(
      id,
      { name, depenseCategory, createdBy, currency, price, description, reference },
      { new: true }
    );

    if (!updatedDepense) return res.status(404).json({ message: 'Depense not found' });

    res.status(200).json(updatedDepense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating depense', error });
  }
};

// Delete a depense by ID
exports.deleteDepense = async (req, res) => {
  const { id } = req.params;

  try {
    const depense = await Depense.findByIdAndDelete(id);
    if (!depense) return res.status(404).json({ message: 'Depense not found' });

    res.status(200).json({ message: 'Depense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting depense', error });
  }
};
