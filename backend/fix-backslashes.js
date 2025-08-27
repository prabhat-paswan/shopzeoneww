const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixBackslashes() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'shopzeo_db'
    });

    console.log('✅ Database connected successfully!');
    
    // Find brands with backslashes
    const [brands] = await connection.execute('SELECT id, name, logo FROM brands WHERE logo LIKE "%\\\\%"');
    
    console.log(`\n🔍 Found ${brands.length} brands with backslashes:`);
    brands.forEach(brand => {
      console.log(`${brand.name}: ${brand.logo}`);
    });

    if (brands.length > 0) {
      // Fix backslashes to forward slashes
      for (const brand of brands) {
        const fixedPath = brand.logo.replace(/\\/g, '/');
        await connection.execute('UPDATE brands SET logo = ? WHERE id = ?', [fixedPath, brand.id]);
        console.log(`✅ Fixed ${brand.name}: ${brand.logo} → ${fixedPath}`);
      }
      
      console.log('\n✅ All backslashes fixed!');
    } else {
      console.log('\n✅ No backslashes found - all paths are correct!');
    }

    // Verify the fix
    console.log('\n🔍 Verifying fixed paths:');
    const [allBrands] = await connection.execute('SELECT id, name, logo FROM brands LIMIT 5');
    allBrands.forEach(brand => {
      console.log(`${brand.name}: ${brand.logo}`);
    });

    await connection.end();
    console.log('\n✅ Database connection closed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixBackslashes();
