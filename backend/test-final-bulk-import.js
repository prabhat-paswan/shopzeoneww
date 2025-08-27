const FormData = require('form-data');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testFinalBulkImport() {
  try {
    console.log('🚀 Testing Final Bulk CSV Import...');
    
    // Check if CSV file exists
    if (!fs.existsSync('./perfect-bulk-import-final.csv')) {
      console.error('❌ Final CSV file not found!');
      return;
    }
    
    // Create form data with CSV file
    const formData = new FormData();
    const csvBuffer = fs.readFileSync('./perfect-bulk-import-final.csv');
    
    formData.append('file', csvBuffer, {
      filename: 'perfect-bulk-import-final.csv',
      contentType: 'text/csv'
    });
    
    formData.append('upsertMode', 'false');

    console.log('📁 Final CSV file loaded, size:', csvBuffer.length, 'bytes');
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
      console.log('📊 Summary:', result.results);
      
      if (result.results.success > 0) {
        console.log(`🎉 Successfully imported ${result.results.success} products!`);
      }
      
      if (result.results.failed > 0) {
        console.log(`⚠️  ${result.results.failed} products failed to import`);
        console.log('❌ Failed rows:', result.failedRows);
      }
    } else {
      console.log('❌ Bulk upload failed!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testFinalBulkImport();
