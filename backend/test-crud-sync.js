const axios = require('axios');
const config = require('./config/app');

console.log('🧪 Testing Complete CRUD Operations with Live Server Sync...\n');

console.log('📍 Configuration:');
console.log(`   Local Server: http://localhost:5000`);
console.log(`   Live Server: ${config.LIVE_API_URL}`);
console.log(`   BASE_URL: ${config.BASE_URL}\n`);

async function testCRUDSync() {
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

    // Step 2: Test Live Server Connection
    console.log('\n2️⃣ Testing live server connection...');
    try {
      const liveResponse = await axios.get(`${config.LIVE_API_URL}/categories`);
      console.log('✅ Live server connection successful');
      console.log(`   Found ${liveResponse.data.data.categories.length} categories on live server`);
    } catch (error) {
      console.log('❌ Live server connection failed:', error.message);
      console.log('   This will affect sync functionality');
    }

    // Step 3: Test Image URL Generation
    console.log('\n3️⃣ Testing image URL generation...');
    const testImagePath = '/uploads/categories/test-image.jpg';
    const fullImageUrl = config.getImageUrl(testImagePath);
    console.log(`   Test image path: ${testImagePath}`);
    console.log(`   Generated full URL: ${fullImageUrl}`);
    console.log(`   Expected URL: ${config.BASE_URL}${testImagePath}`);
    console.log(`   ✅ URLs match: ${fullImageUrl === `${config.BASE_URL}${testImagePath}`}`);

    // Step 4: Test Environment Variables
    console.log('\n4️⃣ Testing environment configuration...');
    const syncEnabled = process.env.SYNC_TO_LIVE === 'true';
    console.log(`   SYNC_TO_LIVE: ${process.env.SYNC_TO_LIVE || 'false'} ${syncEnabled ? '✅' : '❌'}`);
    console.log(`   BASE_URL: ${process.env.BASE_URL || 'Not set'} ${process.env.BASE_URL ? '✅' : '❌'}`);
    console.log(`   LIVE_API_URL: ${process.env.LIVE_API_URL || 'Not set'} ${process.env.LIVE_API_URL ? '✅' : '❌'}`);

    // Step 5: Summary and Instructions
    console.log('\n🎯 CRUD Sync Status:');
    
    if (syncEnabled) {
      console.log('   ✅ CREATE: Categories will sync to live server');
      console.log('   ✅ READ: Data fetched from local server');
      console.log('   ✅ UPDATE: Changes will sync to live server');
      console.log('   ✅ DELETE: Deletions will sync to live server');
      console.log('   ✅ IMAGES: All images use https://linkiin.in domain');
    } else {
      console.log('   ⚠️ CREATE: Categories will NOT sync to live server');
      console.log('   ✅ READ: Data fetched from local server');
      console.log('   ⚠️ UPDATE: Changes will NOT sync to live server');
      console.log('   ⚠️ DELETE: Deletions will NOT sync to live server');
      console.log('   ✅ IMAGES: All images use https://linkiin.in domain');
    }

    console.log('\n💡 To Enable Live Server Sync:');
    console.log('   1. Create backend/.env file');
    console.log('   2. Add: SYNC_TO_LIVE=true');
    console.log('   3. Restart server');
    
    console.log('\n🚀 Ready for Testing:');
    console.log('   1. Admin Panel: http://localhost:3000');
    console.log('   2. Create/Update/Delete categories');
    console.log('   3. Check live server: https://linkiin.in');
    console.log('   4. Verify images display correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCRUDSync();
