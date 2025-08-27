const express = require('express');
const router = express.Router();
const multer = require('multer');
const categoryController = require('../controllers/categoryController');
// const { authenticate, authorize } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Temporarily disable authentication for testing
// router.use(authenticate);

// Get all categories (with pagination and search)
router.get('/', categoryController.getCategories);

// Get single category by ID
router.get('/:id', categoryController.getCategory);

// Create new category
router.post('/', 
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  categoryController.createCategory
);

// Update category
router.put('/:id', 
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  categoryController.updateCategory
);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

// Toggle category status (active/inactive, home category)
router.patch('/:id/toggle', categoryController.toggleCategoryStatus);

// Export categories
router.get('/export/all', categoryController.exportCategories);

module.exports = router;
