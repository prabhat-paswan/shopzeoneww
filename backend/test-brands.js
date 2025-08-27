const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopzeo_db',
  port: process.env.DB_PORT || 3306
};

async function testBrands() {
  let connection;
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Database connected successfully');
    
    // Check if brands table exists
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'brands'",
      [dbConfig.database]
    );
    
    if (tables.length === 0) {
      console.log('❌ Brands table does not exist');
      return;
    }
    
    console.log('✅ Brands table exists');
    
    // Check brands count
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM brands');
    console.log(`📊 Total brands in database: ${countResult[0].count}`);
    
    // Get sample brands with logo paths
    const [brands] = await connection.execute(
      'SELECT id, name, logo, is_active, is_featured FROM brands LIMIT 5'
    );
    
    console.log('\n🏷️  Sample Brands:');
    brands.forEach(brand => {
      console.log(`ID: ${brand.id}, Name: ${brand.name}, Logo: ${brand.logo || 'No logo'}, Active: ${brand.is_active}, Featured: ${brand.is_featured}`);
    });
    
    // Check uploads folder
    const fs = require('fs');
    const path = require('path');
    const uploadsPath = path.join(__dirname, 'uploads', 'brands');
    
    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath);
      console.log(`\n📁 Uploads folder exists with ${files.length} files:`);
      files.forEach(file => {
        console.log(`  - ${file}`);
      });
    } else {
      console.log('\n❌ Uploads folder does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testBrands();
