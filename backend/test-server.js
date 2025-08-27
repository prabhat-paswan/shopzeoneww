const express = require('express');
const app = express();

// Test basic express setup
app.get('/test', (req, res) => {
  res.json({ message: 'Express is working' });
});

// Test product controller import
try {
  console.log('Testing product controller import...');
  const productController = require('./controllers/productController');
  console.log('✅ Product controller imported successfully');
  console.log('Methods:', Object.keys(productController));
  console.log('getProducts type:', typeof productController.getProducts);
  
  // Test product routes
  const productRoutes = require('./routes/products');
  console.log('✅ Product routes imported successfully');
  
} catch (error) {
  console.error('❌ Error importing product controller or routes:', error.message);
  console.error('Stack:', error.stack);
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
