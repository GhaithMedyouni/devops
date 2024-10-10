const Product = require('../models/appmodel/Product');

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, createdBy, currency, price, description, reference } = req.body;

  try {
    const newProduct = new Product({
      name,
      createdBy,
      currency,
      price,
      description,
      reference,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get all products or filter by createdBy
exports.getProducts = async (req, res) => {
  const { createdBy } = req.query;

  try {
    const filter = createdBy ? { createdBy } : {};
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, createdBy, currency, price, description, reference } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, createdBy, currency, price, description, reference },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
