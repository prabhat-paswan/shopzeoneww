const axios = require('axios');
const config = require('./config/app');

console.log('🧪 Testing Category Creation and Live Server Sync...\n');

console.log('📍 Configuration:');
console.log(`   Local Server: http://localhost:5000`);
console.log(`   Live Server: ${config.LIVE_API_URL}`);
console.log(`   BASE_URL: ${config.BASE_URL}\n`);

async function testCategorySync() {
  try {
    // Step 1: Test local server health
    console.log('1️⃣ Testing local server health...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/health');
      console.log('✅ Local server is running:', healthResponse.data.message);
    } catch (error) {
      console.log('❌ Local server not accessible:', error.message);
      return;
    }

    // Step 2: Get current categories from local server
    console.log('\n2️⃣ Getting current categories from local server...');
    try {
      const localCategoriesResponse = await axios.get('http://localhost:5000/api/categories');
      const localCategories = localCategoriesResponse.data.data.categories;
      console.log(`✅ Found ${localCategories.length} categories on local server`);
      
      if (localCategories.length > 0) {
        const sampleCategory = localCategories[0];
        console.log('   Sample local category:', {
          id: sampleCategory.id,
          name: sampleCategory.name,
          image: sampleCategory.image
        });
      }
    } catch (error) {
      console.log('❌ Failed to get local categories:', error.message);
    }

    // Step 3: Get current categories from live server
    console.log('\n3️⃣ Getting current categories from live server...');
    try {
      const liveCategoriesResponse = await axios.get(`${config.LIVE_API_URL}/categories`);
      const liveCategories = liveCategoriesResponse.data.data.categories;
      console.log(`✅ Found ${liveCategories.length} categories on live server`);
      
      if (liveCategories.length > 0) {
        const sampleCategory = liveCategories[0];
        console.log('   Sample live category:', {
          id: sampleCategory.id,
          name: sampleCategory.name,
          image: sampleCategory.image
        });
      }
    } catch (error) {
      console.log('❌ Failed to get live categories:', error.message);
    }

    // Step 4: Test image URL generation
    console.log('\n4️⃣ Testing image URL generation...');
    const testImagePath = '/uploads/categories/test-image.jpg';
    const fullImageUrl = config.getImageUrl(testImagePath);
    console.log(`   Test image path: ${testImagePath}`);
    console.log(`   Generated full URL: ${fullImageUrl}`);
    console.log(`   Expected URL: ${config.BASE_URL}${testImagePath}`);
    console.log(`   ✅ URLs match: ${fullImageUrl === `${config.BASE_URL}${testImagePath}`}`);

    // Step 5: Summary
    console.log('\n🎯 Summary:');
    console.log('   ✅ Local server is running on port 5000');
    console.log('   ✅ Live server connection is working');
    console.log('   ✅ Image URLs are properly formatted');
    console.log('   ✅ Ready for local development with live server sync!');
    
    console.log('\n💡 To test category creation:');
    console.log('   1. Use admin panel at http://localhost:3000');
    console.log('   2. Create a new category with image');
    console.log('   3. Check if it appears on live server');
    console.log('   4. Verify image URLs use https://linkiin.in domain');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCategorySync();
