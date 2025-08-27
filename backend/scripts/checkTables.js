const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shopzeo_db'
};

async function checkTables() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');

    // Show all tables
    console.log('\n🔍 All tables in database:');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });

    // Check brands table
    console.log('\n🔍 Brands table details:');
    const [brandCount] = await connection.execute('SELECT COUNT(*) as count FROM brands');
    console.log(`📊 Brands table has ${brandCount[0].count} records`);

    if (brandCount[0].count > 0) {
      const [sampleBrands] = await connection.execute('SELECT id, name, slug, description FROM brands LIMIT 3');
      console.log('📋 Sample brands:');
      sampleBrands.forEach(brand => {
        console.log(`  - ${brand.name} (${brand.slug}): ${brand.description}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.sql) {
      console.error('SQL Error:', error.sql);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run if this script is executed directly
if (require.main === module) {
  checkTables();
}

module.exports = { checkTables };

