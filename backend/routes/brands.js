const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/featured', brandController.getFeaturedBrands);

// Protected routes (admin only) - TEMPORARILY DISABLED FOR TESTING
// router.use(authenticate);
// router.use(authorize('admin'));

// Brand CRUD operations
router.post('/', brandController.upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), brandController.createBrand);

router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrandById);

router.put('/:id', brandController.upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), brandController.updateBrand);

router.delete('/:id', brandController.deleteBrand);

// Brand management operations
router.patch('/:id/toggle-status', brandController.toggleBrandStatus);
router.patch('/:id/toggle-featured', brandController.toggleBrandFeatured);

// Export functionality
router.get('/export/csv', brandController.exportBrands);

module.exports = router;
