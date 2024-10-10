const DepenseCategory = require('../models/appmodel/DepenseCategory');
const Depense = require('../models/appmodel/Depense');
// Create a new depense category
exports.createDepenseCategory = async (req, res) => {
  const { name, description, color, createdBy } = req.body;

  try {
    const newCategory = new DepenseCategory({
      name,
      description,
      color,
      createdBy,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating depense category', error });
  }
};

// Get all depense categories
exports.getDepenseCategories = async (req, res) => {
    const { createdBy } = req.query;
  try {
   
    const filter = createdBy ? { createdBy } : {};
    const categories = await DepenseCategory.find( filter);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching depense categories', error });
  }
};

// Get a single depense category by ID
exports.getDepenseCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await DepenseCategory.findById(id);
    if (!category) return res.status(404).json({ message: 'Depense category not found' });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching depense category', error });
  }
};

// Update a depense category by ID
exports.updateDepenseCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, color, enabled } = req.body;

  try {
    const updatedCategory = await DepenseCategory.findByIdAndUpdate(
      id,
      { name, description, color, enabled },
      { new: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: 'Depense category not found' });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating depense category', error });
  }
};

// Delete a depense category by ID
exports.deleteDepenseCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const Depenses = await Depense.find({ depenseCategory: id });
    if (Depenses.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete category as it is associated with one or more Depenses.'
      });
    }
    const category = await DepenseCategory.findByIdAndUpdate(
      id
    );
    if (!category) return res.status(404).json({ message: 'Depense category not found' });
    res.status(200).json({ message: 'Depense category removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing depense category', error });
  }
};
