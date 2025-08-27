const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testStoreAndProduct() {
  try {
    console.log('🧪 Testing Store & Product Creation...\n');
    
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
      
      const storeId = storeResult.data.id;
      
      // Test 2: Create a product in the store
      console.log('\n2️⃣ Creating a test product...');
      const productData = {
        product_code: 'PROD001',
        name: 'Test Smartphone',
        description: 'A test smartphone product',
        sku_id: 'SKU001',
        selling_price: 15999,
        mrp: 19999,
        cost_price: 12000,
        quantity: 50,
        gst_percentage: 18,
        store_id: storeId,
        category_id: 1, // Assuming category 1 exists
        product_type: 'Electronics',
        size_type: 'Standard',
        colour: 'Black',
        is_active: true
      };
      
      const productResponse = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      if (productResponse.ok) {
        const productResult = await productResponse.json();
        console.log('✅ Product created successfully:', productResult.data.name);
        console.log(`   Product ID: ${productResult.data.id}`);
        console.log(`   Store ID: ${productResult.data.store_id}`);
        
        // Test 3: Get products by store
        console.log('\n3️⃣ Getting products by store...');
        const storeProductsResponse = await fetch(`http://localhost:5000/api/products/store/${storeId}`);
        
        if (storeProductsResponse.ok) {
          const storeProducts = await storeProductsResponse.json();
          console.log('✅ Store products retrieved successfully');
          console.log(`   Total products in store: ${storeProducts.data.products.length}`);
          console.log(`   Store name: ${storeProducts.data.store.name}`);
        } else {
          console.log('❌ Failed to get store products:', storeProductsResponse.status);
        }
        
      } else {
        console.log('❌ Failed to create product:', productResponse.status);
        const errorData = await productResponse.text();
        console.log('   Error details:', errorData);
      }
      
    } else {
      console.log('❌ Failed to create store:', storeResponse.status);
      const errorData = await storeResponse.text();
      console.log('   Error details:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
  
  console.log('\n🏁 Store & Product testing completed!');
}

testStoreAndProduct();
