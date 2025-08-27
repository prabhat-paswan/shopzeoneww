const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
// const { authenticate, authorize } = require('../middleware/auth');

// Configure multer for CSV uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Temporarily disable authentication for testing
// router.use(authenticate);

// Get all products
router.get('/', productController.getProducts);

// Get single product
router.get('/:id', productController.getProduct);

// Create new product with file uploads
router.post('/', productController.upload.fields([
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 },
  { name: 'image_4', maxCount: 1 },
  { name: 'image_5', maxCount: 1 },
  { name: 'image_6', maxCount: 1 },
  { name: 'image_7', maxCount: 1 },
  { name: 'image_8', maxCount: 1 },
  { name: 'image_9', maxCount: 1 },
  { name: 'image_10', maxCount: 1 },
  { name: 'video_1', maxCount: 1 },
  { name: 'video_2', maxCount: 1 },
  { name: 'size_chart', maxCount: 1 }
]), productController.createProduct);

// Update product with file uploads
router.put('/:id', productController.upload.fields([
  { name: 'image_1', maxCount: 1 },
  { name: 'image_2', maxCount: 1 },
  { name: 'image_3', maxCount: 1 },
  { name: 'image_4', maxCount: 1 },
  { name: 'image_5', maxCount: 1 },
  { name: 'image_6', maxCount: 1 },
  { name: 'image_7', maxCount: 1 },
  { name: 'image_8', maxCount: 1 },
  { name: 'image_9', maxCount: 1 },
  { name: 'image_10', maxCount: 1 },
  { name: 'video_1', maxCount: 1 },
  { name: 'video_2', maxCount: 1 },
  { name: 'size_chart', maxCount: 1 }
]), productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

// Get products by store
router.get('/store/:store_id', productController.getProductsByStore);

// Toggle product status
router.patch('/:id/toggle-status', productController.toggleProductStatus);

// Toggle product featured
router.patch('/:id/toggle-featured', productController.toggleProductFeatured);

// Export products
router.get('/export/all', productController.exportProducts);

// Bulk upload products from CSV
router.post('/bulk-upload', upload.single('csv'), productController.bulkUploadProducts);

module.exports = router;
