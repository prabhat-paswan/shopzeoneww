const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testStoreCreation() {
  try {
    console.log('🧪 Testing Store Creation...\n');
    
    // Test 1: Create a store
    console.log('1️⃣ Creating a test store...');
    const storeData = {
      name: 'Test Electronics Store',
      description: 'A test store for electronics products',
      address: '123 Test Street, Test City, Test State 12345',
      phone: '+91-9876543210',
      email: 'test@store.com',
      gst_number: 'GST123456789',
      gst_percentage: 18,
      zone: 'North Zone',
      estimated_delivery_time: '2-5 days',
      pickup_point: 'Store Location'
    };
    
    const storeResponse = await fetch('http://localhost:5000/api/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(storeData)
    });
    
    if (storeResponse.ok) {
      const storeResult = await storeResponse.json();
      console.log('✅ Store created successfully:', storeResult.data.name);
      console.log(`   Store ID: ${storeResult.data.id}`);
      console.log(`   Store Slug: ${storeResult.data.slug}`);
      console.log(`   GST Number: ${storeResult.data.gst_number}`);
      console.log(`   Zone: ${storeResult.data.zone} (stored but not displayed in list)`);
      
      // Test 2: Get all stores (should not show zone)
      console.log('\n2️⃣ Getting all stores (zone should be hidden)...');
      const getStoresResponse = await fetch('http://localhost:5000/api/stores');
      
      if (getStoresResponse.ok) {
        const storesResult = await getStoresResponse.json();
        console.log('✅ Stores retrieved successfully');
        console.log(`   Total stores: ${storesResult.data.stores.length}`);
        
        // Check if zone is hidden
        const firstStore = storesResult.data.stores[0];
        if (firstStore && !firstStore.hasOwnProperty('zone')) {
          console.log('✅ Zone field is hidden from store list (as requested)');
        } else {
          console.log('❌ Zone field is still visible in store list');
        }
        
        // Display store info without zone
        storesResult.data.stores.forEach((store, index) => {
          console.log(`   Store ${index + 1}: ${store.name} - ${store.address}`);
        });
      } else {
        console.log('❌ Failed to get stores:', getStoresResponse.status);
      }
      
    } else {
      console.log('❌ Failed to create store:', storeResponse.status);
      const errorData = await storeResponse.text();
      console.log('   Error details:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
  
  console.log('\n🏁 Store creation testing completed!');
}

testStoreCreation();
