const axios = require('axios');

console.log('🔍 Checking Live Server Sync Status...\n');

console.log('📍 Configuration:');
console.log('   Local Server: http://localhost:5000');
console.log('   Live Server: https://linkiin.in/api\n');

async function checkLiveSync() {
  try {
    // Step 1: Check local server for new category
    console.log('1️⃣ Checking Local Server for New Category...');
    let localCategories = [];
    let newCategory = null;
    try {
      const localResponse = await axios.get('http://localhost:5000/api/categories');
      localCategories = localResponse.data.data.categories;
      console.log(`   Local Categories Count: ${localCategories.length}`);
      
      // Find the new category we just created
      newCategory = localCategories.find(cat => cat.name === 'Postman Test Category 3');
      if (newCategory) {
        console.log('   ✅ New Category Found on Local Server:');
        console.log(`      ID: ${newCategory.id}`);
        console.log(`      Name: ${newCategory.name}`);
        console.log(`      Image: ${newCategory.image}`);
        console.log(`      Created: ${newCategory.createdAt}`);
      } else {
        console.log('   ❌ New Category NOT Found on Local Server');
        return;
      }
    } catch (error) {
      console.log('   ❌ Failed to get local categories:', error.message);
      return;
    }

    // Step 2: Check live server for the same category
    console.log('\n2️⃣ Checking Live Server for New Category...');
    let newLiveCategory = null;
    try {
      const liveResponse = await axios.get('https://linkiin.in/api/categories');
      const liveCategories = liveResponse.data.data.categories;
      console.log(`   Live Categories Count: ${liveCategories.length}`);
      
      // Find the new category on live server
      newLiveCategory = liveCategories.find(cat => cat.name === 'Postman Test Category 3');
      if (newLiveCategory) {
        console.log('   ✅ New Category Found on Live Server!');
        console.log(`      ID: ${newLiveCategory.id}`);
        console.log(`      Name: ${newLiveCategory.name}`);
        console.log(`      Image: ${newLiveCategory.image || 'No Image'}`);
        console.log(`      Created: ${newLiveCategory.createdAt}`);
        
        // Check if IDs match
        if (newCategory.id === newLiveCategory.id) {
          console.log('   ✅ Category IDs Match - Perfect Sync!');
        } else {
          console.log('   ⚠️ Category IDs Different - Sync Issue');
        }
      } else {
        console.log('   ❌ New Category NOT Found on Live Server');
        console.log('   💡 This means live server sync is not working');
        
        // Show what categories are on live server
        if (liveCategories.length > 0) {
          console.log('\n   📊 Live Server Categories (Last 3):');
          liveCategories.slice(-3).forEach((cat, index) => {
            console.log(`      ${index + 1}. ID: ${cat.id} | Name: ${cat.name} | Image: ${cat.image || 'No Image'}`);
          });
        }
      }
    } catch (error) {
      console.log('   ❌ Failed to get live categories:', error.message);
      console.log('   💡 This could be a network issue or live server down');
    }

    // Step 3: Check environment configuration
    console.log('\n3️⃣ Checking Environment Configuration...');
    const syncEnabled = process.env.SYNC_TO_LIVE === 'true';
    console.log(`   SYNC_TO_LIVE: ${process.env.SYNC_TO_LIVE || 'false'} ${syncEnabled ? '✅' : '❌'}`);
    console.log(`   BASE_URL: ${process.env.BASE_URL || 'Not set'}`);
    console.log(`   LIVE_API_URL: ${process.env.LIVE_API_URL || 'Not set'}`);

    // Step 4: Summary and Recommendations
    console.log('\n🎯 Sync Status Summary:');
    
    if (newLiveCategory) {
      console.log('   ✅ Live Server Sync: WORKING');
      console.log('   ✅ New categories automatically appear on live server');
      console.log('   ✅ Your system is production-ready');
    } else {
      console.log('   ❌ Live Server Sync: NOT WORKING');
      console.log('   ⚠️ New categories only appear locally');
      console.log('   💡 Need to fix live server sync configuration');
    }
    
    console.log('\n🚀 Recommendations:');
    if (!syncEnabled) {
      console.log('   1. ❌ Set SYNC_TO_LIVE=true in .env file');
      console.log('   2. ❌ Restart server after changing .env');
      console.log('   3. ❌ Check live server API connectivity');
    } else {
      console.log('   1. ✅ SYNC_TO_LIVE is enabled');
      console.log('   2. ⚠️ Check live server API connectivity');
      console.log('   3. ⚠️ Verify live server sync service');
    }

  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

// Run the check
checkLiveSync();
