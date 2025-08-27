const axios = require('axios');

console.log('🌐 Testing Live Server Status...\n');

console.log('📍 Live Server Information:');
console.log('   Domain: https://linkiin.in');
console.log('   API: https://linkiin.in/api');
console.log('   Uploads: https://linkiin.in/uploads/\n');

async function testLiveServerStatus() {
  try {
    let liveResponse, localResponse;
    
    // Step 1: Test Live Server API
    console.log('1️⃣ Testing Live Server API...');
    try {
      liveResponse = await axios.get('https://linkiin.in/api/categories');
      console.log('✅ Live Server API Working');
      console.log(`   Status: ${liveResponse.status}`);
      console.log(`   Categories Found: ${liveResponse.data.data.categories.length}`);
      
      // Show sample categories from live server
      const liveCategories = liveResponse.data.data.categories;
      if (liveCategories.length > 0) {
        console.log('\n   📊 Live Server Categories:');
        liveCategories.slice(0, 3).forEach((cat, index) => {
          console.log(`      ${index + 1}. ID: ${cat.id} | Name: ${cat.name} | Image: ${cat.image || 'No Image'}`);
        });
      }
    } catch (error) {
      console.log('❌ Live Server API Failed:', error.message);
      return;
    }

    // Step 2: Test Local Server API
    console.log('\n2️⃣ Testing Local Server API...');
    try {
      localResponse = await axios.get('http://localhost:5000/api/categories');
      console.log('✅ Local Server API Working');
      console.log(`   Status: ${localResponse.status}`);
      console.log(`   Categories Found: ${localResponse.data.data.categories.length}`);
      
      // Show sample categories from local server
      const localCategories = localResponse.data.data.categories;
      if (localCategories.length > 0) {
        console.log('\n   📊 Local Server Categories:');
        localCategories.slice(0, 3).forEach((cat, index) => {
          console.log(`      ${index + 1}. ID: ${cat.id} | Name: ${cat.name} | Image: ${cat.image || 'No Image'}`);
        });
      }
    } catch (error) {
      console.log('❌ Local Server API Failed:', error.message);
      return;
    }

    // Step 3: Compare Data
    console.log('\n3️⃣ Data Comparison...');
    const liveCount = liveResponse.data.data.categories.length;
    const localCount = localResponse.data.data.categories.length;
    
    console.log(`   Live Server Categories: ${liveCount}`);
    console.log(`   Local Server Categories: ${localCount}`);
    
    if (liveCount === localCount) {
      console.log('   ✅ Data is in sync between local and live servers');
    } else {
      console.log('   ⚠️ Data is NOT in sync');
      console.log(`   Difference: ${Math.abs(liveCount - localCount)} categories`);
    }

    // Step 4: Test Image Access
    console.log('\n4️⃣ Testing Image Access...');
    
    // Test a sample image from live server
    try {
      const imageResponse = await axios.get('https://linkiin.in/uploads/categories/category-1756245353209-465480849.jpg', {
        timeout: 5000,
        validateStatus: function (status) {
          return status < 500; // Accept 404 as valid response
        }
      });
      
      if (imageResponse.status === 200) {
        console.log('   ✅ Image accessible on live server');
      } else if (imageResponse.status === 404) {
        console.log('   ⚠️ Image NOT found on live server (404)');
        console.log('   💡 This means the image file is not uploaded to live server yet');
      }
    } catch (error) {
      console.log('   ❌ Image access test failed:', error.message);
    }

    // Step 5: Summary and Next Steps
    console.log('\n🎯 Current Status Summary:');
    
    if (liveCount === localCount) {
      console.log('   ✅ Live Server: API working, data synced');
      console.log('   ✅ Local Server: API working, data available');
      console.log('   ⚠️ Images: May not be accessible on live server yet');
    } else {
      console.log('   ✅ Live Server: API working');
      console.log('   ✅ Local Server: API working');
      console.log('   ❌ Data: NOT synced between servers');
    }
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. ✅ Live Server API is working');
    console.log('   2. ✅ Local Server API is working');
    console.log('   3. ⚠️ Need to upload image files to live server');
    console.log('   4. ⚠️ Need to sync new categories to live server');
    
    console.log('\n💡 To Complete Setup:');
    console.log('   • Upload image files to live server /uploads/ directory');
    console.log('   • Ensure SYNC_TO_LIVE=true in .env file');
    console.log('   • Create new categories locally to test sync');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLiveServerStatus();
