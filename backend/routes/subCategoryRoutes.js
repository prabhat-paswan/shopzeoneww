const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
// const { authenticate, authorize } = require('../middleware/auth');

// Temporarily disable authentication for testing
// router.use(authenticate);

// Get all sub categories (with pagination and search)
router.get('/', subCategoryController.getSubCategories);

// Get single sub category by ID
router.get('/:id', subCategoryController.getSubCategory);

// Create new sub category
router.post('/', subCategoryController.createSubCategory);


// Update sub category
router.put('/:id', subCategoryController.updateSubCategory);

// Delete sub category
router.delete('/:id', subCategoryController.deleteSubCategory);

// Toggle sub category status
router.patch('/:id/toggle', subCategoryController.toggleSubCategoryStatus);

// Export sub categories
router.get('/export/all', subCategoryController.exportSubCategories);

module.exports = router;
