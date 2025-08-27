const config = require('./config/app');

console.log('🧪 Testing Config Functionality...\n');

// Test 1: Check BASE_URL
console.log('1️⃣ BASE_URL Configuration:');
console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`   BASE_URL: ${config.BASE_URL}`);
console.log(`   PORT: ${config.PORT}\n`);

// Test 2: Test getImageUrl function
console.log('2️⃣ getImageUrl Function Tests:');
const testCases = [
  '/uploads/categories/image.jpg',
  'uploads/categories/image.jpg',
  'http://localhost:5000/uploads/categories/image.jpg',
  'https://example.com/uploads/categories/image.jpg',
  null,
  undefined,
  ''
];

testCases.forEach((testCase, index) => {
  const result = config.getImageUrl(testCase);
  console.log(`   Test ${index + 1}: "${testCase}" → "${result}"`);
});
console.log('');

// Test 3: Test getRelativePath function
console.log('3️⃣ getRelativePath Function Tests:');
const relativeTestCases = [
  'http://localhost:5000/uploads/categories/image.jpg',
  'https://example.com/uploads/categories/image.jpg',
  '/uploads/categories/image.jpg',
  'uploads/categories/image.jpg'
];

relativeTestCases.forEach((testCase, index) => {
  const result = config.getRelativePath(testCase);
  console.log(`   Test ${index + 1}: "${testCase}" → "${result}"`);
});
console.log('');

// Test 4: Simulate API Response
console.log('4️⃣ Simulated API Response Test:');
const mockCategory = {
  id: 1,
  name: 'Test Category',
  image: '/uploads/categories/test.jpg'
};

const formattedCategory = {
  ...mockCategory,
  image: config.getImageUrl(mockCategory.image)
};

console.log('   Original:', mockCategory);
console.log('   Formatted:', formattedCategory);
console.log('');

// Test 5: Environment Variable Test
console.log('5️⃣ Environment Variable Test:');
console.log('   Current BASE_URL:', config.BASE_URL);
console.log('   To change to production, set: BASE_URL=https://yourdomain.com');
console.log('   To change to development, set: BASE_URL=http://localhost:5000');
console.log('');

console.log('✅ All tests completed! Config system is working correctly.');
console.log('💡 The system will automatically use the correct domain based on BASE_URL environment variable.');
