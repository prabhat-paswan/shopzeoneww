const express = require('express');
const router = express.Router();
const {
  getCategoryHierarchy,
  getNavigationCategories,
  getCategoryWithSubcategories
} = require('../controllers/categoryHierarchyController');

// Get complete category hierarchy (for admin panel)
router.get('/hierarchy', getCategoryHierarchy);

// Get navigation categories (for frontend dropdown)
router.get('/navigation', getNavigationCategories);

// Get single category with subcategories
router.get('/:categoryId', getCategoryWithSubcategories);

module.exports = router;
