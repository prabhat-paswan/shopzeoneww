const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopzeo_db',
  port: process.env.DB_PORT || 3306
};

async function fixAllBrands() {
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
    
    // Get all brands from database
    const [brands] = await connection.execute('SELECT id, name, logo FROM brands ORDER BY id');
    console.log(`\n🏷️  Found ${brands.length} brands in database`);
    
    // Create a mapping of brands to logo files
    const brandLogoMap = [
      { brandId: 1, brandName: 'Samsung', logoFile: 'brand-1755882682399-606248210.jpeg' },
      { brandId: 2, brandName: 'LG', logoFile: 'brand-1755883618471-749353359.jpg' },
      { brandId: 3, brandName: 'Whirlpool', logoFile: 'brand-1755983730672-929170786.jpg' },
      { brandId: 4, brandName: 'Bosch', logoFile: 'brand-1755882682399-606248210.jpeg' },
      { brandId: 5, brandName: 'Philips', logoFile: 'brand-1755883618471-749353359.jpg' },
      { brandId: 6, brandName: 'shopzeo', logoFile: 'brand-1755882682399-606248210.jpeg' },
      { brandId: 7, brandName: 'qqqq', logoFile: 'brand-1755883618471-749353359.jpg' },
      { brandId: 8, brandName: 'Dream Craft', logoFile: 'brand-1755983730672-929170786.jpg' }
    ];
    
    // Update all brands with correct logo paths
    console.log('\n🔄 Updating all brands with correct logo paths...');
    
    for (const mapping of brandLogoMap) {
      const newLogoPath = `uploads/brands/${mapping.logoFile}`;
      
      console.log(`\n🔄 Updating brand "${mapping.brandName}" (ID: ${mapping.brandId})`);
      console.log(`  New logo: ${newLogoPath}`);
      
      await connection.execute(
        'UPDATE brands SET logo = ? WHERE id = ?',
        [newLogoPath, mapping.brandId]
      );
      
      console.log(`  ✅ Updated successfully`);
    }
    
    // Verify all updates
    console.log('\n🔍 Verifying all updates...');
    const [updatedBrands] = await connection.execute('SELECT id, name, logo FROM brands ORDER BY id');
    
    updatedBrands.forEach(brand => {
      console.log(`ID: ${brand.id}, Name: ${brand.name}, Logo: ${brand.logo || 'No logo'}`);
    });
    
    console.log('\n🎉 All brand logo paths updated successfully!');
    console.log('📱 Now check your admin panel at: http://localhost:3001/admin/brands');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixAllBrands();
