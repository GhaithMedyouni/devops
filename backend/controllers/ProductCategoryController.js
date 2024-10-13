const Product = require('../models/appmodel/Product');
const ProductCategory = require('../models/appmodel/ProductCategory');

// Create a new product category
exports.createProductCategory = async (req, res) => {
  const { name, description, color, createdBy } = req.body;

  try {
    const newCategory = new ProductCategory({
      name,
      description,
      color,
      createdBy,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product category', error });
  }
};

// Get all product categories
exports.getProductCategories = async (req, res) => {
    const adminId = req.query.createdBy;
  try {
    const categories = await ProductCategory.find({ createdBy: adminId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product categories', error });
  }
};

// Get a single product category by ID
exports.getProductCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await ProductCategory.findById(id);
    if (!category) return res.status(404).json({ message: 'Product category not found' });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product category', error });
  }
};

// Update a product category by ID
exports.updateProductCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, color, enabled } = req.body;

  try {
    const updatedCategory = await ProductCategory.findByIdAndUpdate(
      id,
      { name, description, color, enabled },
      { new: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: 'Product category not found' });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product category', error });
  }
};

// Delete a product category by ID
exports.deleteProductCategory = async (req, res) => {
  const { id } = req.params;

  try {

      // Check if there are products associated with this category
      const products = await Product.find({ productCategory: id });

      if (products.length > 0) {
        return res.status(400).json({
          message: 'Cannot delete category as it is associated with one or more products.'
        });
      }

    const category = await ProductCategory.findByIdAndDelete(
      id
    );

    if (!category) return res.status(404).json({ message: 'Product category not found' });

    res.status(200).json({ message: 'Product category removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product category', error });
  }
};
