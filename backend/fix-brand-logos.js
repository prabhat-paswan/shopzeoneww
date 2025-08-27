const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopzeo_db',
  port: process.env.DB_PORT || 3306
};

async function fixBrandLogos() {
  let connection;
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Database connected successfully');
    
    // Check uploads folder for actual files
    const fs = require('fs');
    const path = require('path');
    const uploadsPath = path.join(__dirname, 'uploads', 'brands');
    
    if (!fs.existsSync(uploadsPath)) {
      console.log('❌ Uploads folder does not exist');
      return;
    }
    
    const files = fs.readdirSync(uploadsPath);
    console.log(`📁 Found ${files.length} files in uploads folder:`);
    files.forEach(file => console.log(`  - ${file}`));
    
    // Get current brands from database
    const [brands] = await connection.execute('SELECT id, name, logo FROM brands');
    console.log(`\n🏷️  Found ${brands.length} brands in database`);
    
    // Update brands with correct logo paths
    for (let i = 0; i < brands.length && i < files.length; i++) {
      const brand = brands[i];
      const newLogoPath = `uploads/brands/${files[i]}`;
      
      console.log(`\n🔄 Updating brand "${brand.name}" (ID: ${brand.id})`);
      console.log(`  Old logo: ${brand.logo || 'No logo'}`);
      console.log(`  New logo: ${newLogoPath}`);
      
      await connection.execute(
        'UPDATE brands SET logo = ? WHERE id = ?',
        [newLogoPath, brand.id]
      );
      
      console.log(`  ✅ Updated successfully`);
    }
    
    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const [updatedBrands] = await connection.execute('SELECT id, name, logo FROM brands');
    
    updatedBrands.forEach(brand => {
      console.log(`ID: ${brand.id}, Name: ${brand.name}, Logo: ${brand.logo || 'No logo'}`);
    });
    
    console.log('\n🎉 Brand logo paths updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixBrandLogos();
