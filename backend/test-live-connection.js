const liveServerSync = require('./services/liveServerSync');
const config = require('./config/app');

console.log('🚀 Testing Live Server Connection...\n');

console.log('📍 Configuration:');
console.log(`   Local Server: http://localhost:${config.PORT}`);
console.log(`   Live Server: ${config.LIVE_API_URL}`);
console.log(`   BASE_URL: ${config.BASE_URL}`);
console.log(`   CORS Origins: ${config.ALLOWED_ORIGINS.join(', ')}\n`);

async function testLiveConnection() {
  try {
    console.log('1️⃣ Testing connection to live server...');
    
    // Try different endpoints to find a working one
    const endpoints = ['health', 'categories', 'brands', 'banners'];
    let isConnected = false;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`   Trying endpoint: /${endpoint}`);
        const response = await liveServerSync.getFromLive(endpoint, { limit: 1 });
        console.log(`   ✅ Endpoint /${endpoint} is working!`);
        isConnected = true;
        break;
      } catch (error) {
        console.log(`   ❌ Endpoint /${endpoint} failed: ${error.response?.status || error.message}`);
      }
    }
    
    if (isConnected) {
      console.log('\n✅ Live server connection successful!\n');
      
      console.log('2️⃣ Testing data retrieval from live server...');
      try {
        const categories = await liveServerSync.getFromLive('categories', { limit: 5 });
        console.log('✅ Retrieved categories from live server:', categories.data?.categories?.length || 0, 'categories');
        
        // Show sample data
        if (categories.data?.categories?.length > 0) {
          const sampleCategory = categories.data.categories[0];
          console.log('   Sample category:', {
            id: sampleCategory.id,
            name: sampleCategory.name,
            image: sampleCategory.image
          });
        }
      } catch (error) {
        console.log('⚠️ Could not retrieve categories from live server (may need authentication)');
      }
      
      console.log('\n3️⃣ Ready for local development with live server sync!');
      console.log('💡 Set SYNC_TO_LIVE=true in .env to enable automatic sync');
      
    } else {
      console.log('\n❌ Live server connection failed');
      console.log('💡 Check your internet connection and live server status');
      console.log('💡 The live server might not have the expected endpoints');
      console.log('💡 You may need to check the actual API structure on linkiin.in');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLiveConnection();
