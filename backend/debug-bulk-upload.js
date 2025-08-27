const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function debugBulkUpload() {
  try {
    console.log('🔍 Debugging bulk upload endpoint...');
    
    // Test 1: Check if endpoint exists
    console.log('\n1️⃣ Testing endpoint availability...');
    const healthResponse = await fetch('http://localhost:5000/health');
    console.log('Health check status:', healthResponse.status);
    
    // Test 2: Check bulk upload endpoint
    console.log('\n2️⃣ Testing bulk upload endpoint...');
    const bulkResponse = await fetch('http://localhost:5000/api/admin/products/import-status');
    console.log('Bulk upload status endpoint:', bulkResponse.status);
    
    // Test 3: Try to get more info about the error
    console.log('\n3️⃣ Testing with minimal data...');
    
    const formData = new FormData();
    const csvContent = 'Product Code,Name,Sku Id,Selling Price,Category ID,Store ID\nTEST001,Test Product,SKU001,100,1,ce32fe90-7eaa-11f0-a328-f5704f3e47ab';
    const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    
    formData.append('file', csvBlob, 'test.csv');
    formData.append('upsertMode', 'false');
    
    console.log('📤 Sending minimal CSV...');
    const uploadResponse = await fetch('http://localhost:5000/api/admin/products/import-csv', {
      method: 'POST',
      body: formData
    });
    
    console.log('Upload response status:', uploadResponse.status);
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.log('Error response:', errorText);
    } else {
      const result = await uploadResponse.json();
      console.log('Success response:', result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the debug
debugBulkUpload();
