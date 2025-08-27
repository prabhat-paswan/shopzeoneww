const productController = require('./controllers/productController');

console.log('Product Controller loaded successfully');
console.log('Available methods:', Object.keys(productController));
console.log('getProducts method:', typeof productController.getProducts);
console.log('upload method:', typeof productController.upload);
