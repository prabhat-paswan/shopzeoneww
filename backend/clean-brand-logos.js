const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopzeo_db',
  port: process.env.DB_PORT || 3306
};

async function cleanBrandLogos() {
  let connection;
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Database connected successfully');
    
    // Get all brands with incorrect logo paths
    const [brands] = await connection.execute('SELECT id, name, logo FROM brands');
    
    console.log('\n🧹 Cleaning up logo paths...');
    
    for (const brand of brands) {
      let newLogoPath = brand.logo;
      
      // Fix absolute paths
      if (brand.logo && brand.logo.includes('C:\\')) {
        newLogoPath = brand.logo.split('uploads\\brands\\')[1];
        if (newLogoPath) {
          newLogoPath = `uploads/brands/${newLogoPath}`;
        }
      }
      
      // Fix backslash paths
      if (brand.logo && brand.logo.includes('\\')) {
        newLogoPath = brand.logo.replace(/\\/g, '/');
      }
      
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
    
    console.log('\n🎉 Logo paths cleaned successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

cleanBrandLogos();
