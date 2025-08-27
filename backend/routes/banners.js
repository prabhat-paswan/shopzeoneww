const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes (admin only) - TEMPORARILY DISABLED FOR TESTING
// router.use(authenticate);
// router.use(authorize('admin'));

// Banner CRUD operations
router.post('/', bannerController.upload.single('image'), bannerController.createBanner);

router.get('/', bannerController.getBanners);
router.get('/:id', bannerController.getBannerById);

router.put('/:id', bannerController.upload.single('image'), bannerController.updateBanner);

router.delete('/:id', bannerController.deleteBanner);

// Banner management operations
router.patch('/:id/toggle-status', bannerController.toggleBannerStatus);
router.patch('/:id/toggle-featured', bannerController.toggleBannerFeatured);

module.exports = router;
