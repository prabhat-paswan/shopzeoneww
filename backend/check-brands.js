const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkBrands() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'shopzeo_db'
    });

    console.log('✅ Database connected successfully!');
    
    // Check brands table
    const [brands] = await connection.execute('SELECT id, name, logo FROM brands LIMIT 10');
    
    console.log('\n📋 Brand Logo Paths:');
    console.log('ID | Name | Logo Path');
    console.log('---|------|-----------');
    
    brands.forEach(brand => {
      console.log(`${brand.id} | ${brand.name} | ${brand.logo || 'NO LOGO'}`);
    });

    // Check if logo files exist
    console.log('\n🔍 Checking if logo files exist:');
    const fs = require('fs');
    const path = require('path');
    
    brands.forEach(brand => {
      if (brand.logo) {
        const fullPath = path.join(__dirname, brand.logo);
        const exists = fs.existsSync(fullPath);
        console.log(`${brand.name}: ${exists ? '✅ EXISTS' : '❌ MISSING'} - ${fullPath}`);
      }
    });

    await connection.end();
    console.log('\n✅ Database connection closed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkBrands();
