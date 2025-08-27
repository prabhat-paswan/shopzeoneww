const csv = require('csv-parser');
const fs = require('fs');

async function debugCSVParserConfig() {
  try {
    console.log('🔍 Debugging CSV Parser Configuration...');
    
    // Test with different CSV parser options
    const options = [
      {},
      { separator: ',' },
      { strict: false },
      { skipEmptyLines: false }
    ];
    
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      console.log(`\n📋 Testing with options ${i + 1}:`, option);
      
      const csvData = await new Promise((resolve, reject) => {
        const rows = [];
        fs.createReadStream('./perfect-bulk-import-working.csv')
          .pipe(csv(option))
          .on('data', (row) => {
            if (rows.length === 0) { // Only show first row
              console.log('🔑 Available keys:', Object.keys(row));
              console.log('🏪 Store ID value:', row['Store ID']);
              console.log('🏪 Store ID exists:', 'Store ID' in row);
              console.log('🔍 All column names:');
              Object.keys(row).forEach(key => {
                console.log(`  - "${key}" (length: ${key.length})`);
              });
            }
            rows.push(row);
          })
          .on('end', () => resolve(rows))
          .on('error', reject);
      });
      
      console.log(`📊 Total rows parsed: ${csvData.length}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the debug
debugCSVParserConfig();
