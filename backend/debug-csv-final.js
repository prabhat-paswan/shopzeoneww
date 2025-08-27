const csv = require('csv-parser');
const fs = require('fs');

async function debugCSVFinal() {
  try {
    console.log('🔍 Debugging Final CSV parsing...');
    
    // Read the raw file content first
    const rawContent = fs.readFileSync('./perfect-bulk-import-final.csv', 'utf8');
    console.log('📄 Raw file content (first 500 chars):');
    console.log(rawContent.substring(0, 500));
    console.log('---');
    
    // Check the header line specifically
    const lines = rawContent.split('\n');
    console.log('📋 Header line:', lines[0]);
    console.log('🔑 Header columns:', lines[0].split(','));
    console.log('🔍 Looking for Store ID in header...');
    console.log('Store ID found:', lines[0].includes('Store ID'));
    console.log('Store ID index:', lines[0].split(',').indexOf('Store ID'));
    console.log('---');
    
    // Now parse with csv-parser
    const csvData = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream('./perfect-bulk-import-final.csv')
        .pipe(csv())
        .on('data', (row) => {
          console.log('📋 Parsed row keys:', Object.keys(row));
          console.log('🏪 Store ID value:', row['Store ID']);
          console.log('🏪 Store ID exists:', 'Store ID' in row);
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
debugCSVFinal();
