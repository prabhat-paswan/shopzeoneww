const fs = require('fs');
const FormData = require('form-data');

async function testCSVUpload() {
    console.log('🚀 Testing CSV Bulk Upload...\n');
    
    try {
        // Dynamic import for node-fetch v3
        const { default: fetch } = await import('node-fetch');
        
        // Read the CSV file
        const csvPath = './sample-products-corrected.csv';
        if (!fs.existsSync(csvPath)) {
            console.log('❌ CSV file not found:', csvPath);
            return;
        }
        
        const csvContent = fs.readFileSync(csvPath);
        console.log('✅ CSV file loaded:', csvPath);
        console.log('📊 File size:', csvContent.length, 'bytes');
        
        // Create form data
        const form = new FormData();
        form.append('csv', csvContent, {
            filename: 'sample-products.csv',
            contentType: 'text/csv'
        });
        
        console.log('🔄 Uploading to API...');
        
        // Make the request
        const response = await fetch('http://localhost:5000/api/products/bulk-upload', {
            method: 'POST',
            body: form
        });
        
        const result = await response.json();
        
        console.log('\n📊 Response Status:', response.status);
        console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
        
        if (result.success) {
            console.log('\n✅ UPLOAD SUCCESSFUL!');
            console.log('📦 Products Uploaded:', result.uploaded);
            console.log('📊 Total Processed:', result.total);
            console.log('❌ Errors:', result.errorCount);
            
            if (result.errors && result.errors.length > 0) {
                console.log('\n⚠️ Errors encountered:');
                result.errors.forEach(error => console.log('  -', error));
            }
        } else {
            console.log('\n❌ UPLOAD FAILED!');
            console.log('Error:', result.message);
            if (result.error) {
                console.log('Details:', result.error);
            }
        }
        
    } catch (error) {
        console.error('\n💥 Test failed with error:', error.message);
        console.error('Stack:', error.stack);
    }
}

// Check if required modules are available
try {
    require('form-data');
    testCSVUpload();
} catch (error) {
    console.log('❌ Required modules not found. Installing...');
    console.log('Run: npm install form-data node-fetch');
    console.log('Or use the HTML test page: test-csv-upload.html');
}
