const express = require('express');
const router = express.Router();
const {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
  toggleStoreStatus,
  toggleStoreVerification,
  updateVendorPassword,
  exportStores
} = require('../controllers/storeController');
const { authenticate, adminOnly } = require('../middleware/auth');

// Create a new store (admin only) - Temporarily disabled auth for testing
router.post('/', createStore);

// Get all stores with pagination and search (admin only)
router.get('/', getAllStores); // Temporarily disabled auth for testing

// Get store by ID (admin only) - Temporarily disabled auth for testing
router.get('/:id', getStoreById);

// Update store (admin only) - Temporarily disabled auth for testing
router.put('/:id', updateStore);

// Delete store (admin only) - Temporarily disabled auth for testing
router.delete('/:id', deleteStore);

// Toggle store status (active/inactive) (admin only) - Temporarily disabled auth for testing
router.patch('/:id/toggle-status', toggleStoreStatus);

// Toggle store verification (admin only) - Temporarily disabled auth for testing
router.patch('/:id/toggle-verification', toggleStoreVerification);

// Update vendor password (admin only) - Temporarily disabled auth for testing
router.patch('/:id/update-password', updateVendorPassword);

// Export stores to CSV (admin only) - Temporarily disabled auth for testing
router.get('/export/csv', exportStores);

module.exports = router;
