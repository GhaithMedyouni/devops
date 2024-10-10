const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/ProductCategoryController');

// Create a new product category
router.post('/', productCategoryController.createProductCategory);

// Get all product categories
router.get('/', productCategoryController.getProductCategories);

// Get a single product category by ID
router.get('/:id', productCategoryController.getProductCategoryById);

// Update a product category by ID
router.put('/:id', productCategoryController.updateProductCategory);

// Delete a product category by ID
router.delete('/:id', productCategoryController.deleteProductCategory);

module.exports = router;
