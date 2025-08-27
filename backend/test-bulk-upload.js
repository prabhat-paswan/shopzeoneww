const FormData = require('form-data');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBulkUpload() {
  try {
    console.log('🔄 Testing bulk CSV upload...');
    
    // Create form data with CSV file
    const formData = new FormData();
    const csvBuffer = fs.readFileSync('./test-bulk-upload.csv');
    
    formData.append('file', csvBuffer, {
      filename: 'test-bulk-upload.csv',
      contentType: 'text/csv'
    });
    
    formData.append('upsertMode', 'false');

    console.log('📁 CSV file loaded, size:', csvBuffer.length, 'bytes');
    console.log('📤 Uploading to bulk import endpoint...');

    const response = await fetch('http://localhost:5000/api/admin/products/import-csv', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Bulk upload successful!');
      console.log('📊 Summary:', result.summary);
    } else {
      console.log('❌ Bulk upload failed!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testBulkUpload();
