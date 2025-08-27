const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopzeo_db',
  port: process.env.DB_PORT || 3306
};

async function finalCleanup() {
  let connection;
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Database connected successfully');
    
    // Get all brands with problematic logo paths
    const [brands] = await connection.execute('SELECT id, name, logo FROM brands');
    
    console.log('\n🧹 Final cleanup of logo paths...');
    
    for (const brand of brands) {
      if (!brand.logo) continue;
      
      let newLogoPath = brand.logo;
      
      // Remove quotes
      if (brand.logo.startsWith('"') && brand.logo.endsWith('"')) {
        newLogoPath = brand.logo.slice(1, -1);
      }
      
      // Convert absolute paths to relative
      if (newLogoPath.includes('C:/') || newLogoPath.includes('C:\\')) {
        const parts = newLogoPath.split('uploads');
        if (parts.length > 1) {
          newLogoPath = `uploads${parts[1]}`;
        }
      }
      
      // Ensure forward slashes
      newLogoPath = newLogoPath.replace(/\\/g, '/');
      
      // Update if path changed
      if (newLogoPath !== brand.logo) {
        console.log(`🔄 Fixing brand "${brand.name}" (ID: ${brand.id})`);
        console.log(`  Old: ${brand.logo}`);
        console.log(`  New: ${newLogoPath}`);
        
        await connection.execute(
          'UPDATE brands SET logo = ? WHERE id = ?',
          [newLogoPath, brand.id]
        );
        
        console.log(`  ✅ Fixed successfully`);
      }
    }
    
    // Verify final state
    console.log('\n🔍 Final logo paths:');
    const [finalBrands] = await connection.execute('SELECT id, name, logo FROM brands');
    
    finalBrands.forEach(brand => {
      console.log(`ID: ${brand.id}, Name: ${brand.name}, Logo: ${brand.logo || 'No logo'}`);
    });
    
    console.log('\n🎉 All logo paths cleaned successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

finalCleanup();
