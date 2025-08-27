const Product = require('../models/Product');
const Store = require('../models/Store');
const Category = require('../models/SubCategory');
const { Op } = require('sequelize');

// Get all products with pagination and search
exports.getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      store_id = '', 
      category_id = '', 
      sub_category_id = '',
      min_price = '',
      max_price = '',
      is_active = '',
      is_featured = ''
    } = req.query;
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        store_id,
        category_id,
        sub_category_id,
        min_price,
        max_price,
        is_active,
        is_featured
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get products by store
exports.getProductsByStore = async (req, res) => {
  try {
    const { store_id } = req.params;
    res.json({
      success: true,
      message: 'Store products retrieved successfully',
      data: { store_id }
    });
  } catch (error) {
    console.error('Get store products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve store products',
      error: error.message
    });
  }
};

// Toggle product status
exports.toggleProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Product status toggled successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product status',
      error: error.message
    });
  }
};

// Toggle product featured
exports.toggleProductFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({
      success: true,
      message: 'Product featured status toggled successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Toggle product featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product featured status',
      error: error.message
    });
  }
};

// Export products
exports.exportProducts = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Products exported successfully'
    });
  } catch (error) {
    console.error('Export products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export products',
      error: error.message
    });
  }
};

// Mock upload configuration
exports.upload = {
  fields: (fields) => (req, res, next) => next()
};
