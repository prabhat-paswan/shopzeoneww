const config = require('./config/app');

console.log('🧪 Testing getImageUrl Function...\n');

console.log('📍 Configuration:');
console.log(`   BASE_URL: ${config.BASE_URL}\n`);

// Test cases
const testCases = [
  '/uploads/categories/test.jpg',
  'uploads/categories/test.jpg',
  'https://linkiin.in/uploads/categories/test.jpg',
  'http://localhost:5000/uploads/categories/test.jpg',
  null,
  ''
];

console.log('🔍 Testing getImageUrl function:');
testCases.forEach((testPath, index) => {
  const result = config.getImageUrl(testPath);
  console.log(`   Test ${index + 1}: "${testPath}"`);
  console.log(`   Result: "${result}"`);
  console.log(`   Starts with http: ${testPath ? testPath.startsWith('http') : 'N/A'}`);
  console.log('');
});

// Test with actual database paths
console.log('📸 Testing with actual database paths:');
const actualPaths = [
  'https://linkiin.in/uploads/categories/category-1756245353209-465480849.jpg',
  'https://linkiin.in/uploads/categories/category-1756244640939-292978364.webp'
];

actualPaths.forEach((path, index) => {
  const result = config.getImageUrl(path);
  console.log(`   Path ${index + 1}: "${path}"`);
  console.log(`   Result: "${result}"`);
  console.log(`   Should be unchanged: ${result === path}`);
  console.log('');
});
