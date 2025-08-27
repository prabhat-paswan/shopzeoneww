const csv = require('csv-parser');
const fs = require('fs');

async function debugCSVParsing() {
  try {
    console.log('🔍 Debugging CSV parsing...');
    
    const csvData = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream('./perfect-bulk-import-fixed.csv')
        .pipe(csv())
        .on('data', (row) => {
          console.log('📋 Raw row data:', row);
          console.log('🔑 Available keys:', Object.keys(row));
          console.log('🏪 Store ID value:', row['Store ID']);
          console.log('🏪 Store ID type:', typeof row['Store ID']);
          console.log('🏪 Store ID length:', row['Store ID'] ? row['Store ID'].length : 'null');
          console.log('---');
          rows.push(row);
        })
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
    
    console.log(`📊 Total rows parsed: ${csvData.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the debug
debugCSVParsing();
