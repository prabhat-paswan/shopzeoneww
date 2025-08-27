const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shopzeo_db',
  multipleStatements: false
};

async function executeSqlFile(connection, filePath) {
  try {
    const sqlContent = await fs.readFile(filePath, 'utf8');
    
    // Split SQL statements by semicolon and filter out empty lines
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error.message);
    throw error;
  }
}

async function runMigrations() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');

    // Run brands migration
    console.log('📋 Running brands table migration...');
    await executeSqlFile(connection, path.join(__dirname, '../database/migrations/005_create_brands_table.sql'));
    console.log('✅ Brands table created successfully');

    // Run banners migration
    console.log('📋 Running banners table migration...');
    await executeSqlFile(connection, path.join(__dirname, '../database/migrations/006_create_banners_table.sql'));
    console.log('✅ Banners table created successfully');

    console.log('🎉 All migrations completed successfully!');
    
    // Verify tables exist
    console.log('🔍 Verifying tables...');
    const [brandTables] = await connection.execute('SHOW TABLES LIKE "brands"');
    if (brandTables.length > 0) {
      console.log('✅ Brands table exists');
      
      // Check sample data
      const [brandCount] = await connection.execute('SELECT COUNT(*) as count FROM brands');
      console.log(`📊 Brands table has ${brandCount[0].count} records`);
    }
    
    const [bannerTables] = await connection.execute('SHOW TABLES LIKE "banners"');
    if (bannerTables.length > 0) {
      console.log('✅ Banners table exists');
      
      // Check sample data
      const [bannerCount] = await connection.execute('SELECT COUNT(*) as count FROM banners');
      console.log(`📊 Banners table has ${bannerCount[0].count} records`);
    }

  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    if (error.sql) {
      console.error('SQL Error:', error.sql);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
