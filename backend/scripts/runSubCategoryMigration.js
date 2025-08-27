const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopzeo_db',
  port: process.env.DB_PORT || 3306
};

async function runMigration() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully!');

    // Read the migration file
    const migrationPath = path.join(__dirname, '../database/migrations/002_create_sub_categories_table.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    console.log('📖 Reading migration file...');
    console.log('📝 Migration SQL loaded successfully');

    // Split the SQL into individual statements - improved parsing
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // Remove comments and empty statements
        const cleanStmt = stmt.replace(/--.*$/gm, '').trim();
        return cleanStmt.length > 0 && 
               !cleanStmt.startsWith('--') && 
               !cleanStmt.toLowerCase().startsWith('insert') &&
               !cleanStmt.toLowerCase().startsWith('create');
      });

    // Add the main CREATE TABLE statement
    const createTableSQL = `CREATE TABLE IF NOT EXISTS \`sub_categories\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL COMMENT 'Sub category name in English',
  \`slug\` varchar(255) NOT NULL COMMENT 'URL-friendly sub category name',
  \`priority\` int(11) DEFAULT 0 COMMENT 'Display priority order',
  \`isActive\` tinyint(1) DEFAULT 1 COMMENT 'Sub category status (0=Inactive, 1=Active)',
  \`categoryId\` int(11) NOT NULL COMMENT 'Parent category ID',
  \`metaTitle\` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  \`metaDescription\` text DEFAULT NULL COMMENT 'SEO meta description',
  \`metaKeywords\` text DEFAULT NULL COMMENT 'SEO meta keywords',
  \`createdBy\` int(11) DEFAULT NULL COMMENT 'User ID who created the sub category',
  \`updatedBy\` int(11) DEFAULT NULL COMMENT 'User ID who last updated the sub category',
  \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_sub_categories_slug\` (\`slug\`),
  KEY \`idx_sub_categories_category_id\` (\`categoryId\`),
  KEY \`idx_sub_categories_is_active\` (\`isActive\`),
  KEY \`idx_sub_categories_priority\` (\`priority\`),
  KEY \`idx_sub_categories_created_at\` (\`createdAt\`),
  KEY \`idx_sub_categories_updated_at\` (\`updatedAt\`),
  CONSTRAINT \`fk_sub_categories_category\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_sub_categories_created_by\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT \`fk_sub_categories_updated_by\` FOREIGN KEY (\`updatedBy\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Product sub categories table'`;

    const insertDataSQL = `INSERT INTO \`sub_categories\` (\`name\`, \`slug\`, \`priority\`, \`isActive\`, \`categoryId\`, \`createdAt\`, \`updatedAt\`) VALUES
('Smartphones', 'smartphones', 1, 1, 1, NOW(), NOW()),
('Laptops', 'laptops', 2, 1, 1, NOW(), NOW()),
('Tablets', 'tablets', 3, 1, 1, NOW(), NOW()),
('Men\\'s Clothing', 'mens-clothing', 1, 1, 2, NOW(), NOW()),
('Women\\'s Clothing', 'womens-clothing', 2, 1, 2, NOW(), NOW()),
('Kids\\'s Clothing', 'kids-clothing', 3, 1, 2, NOW(), NOW()),
('Furniture', 'furniture', 1, 1, 3, NOW(), NOW()),
('Kitchen & Dining', 'kitchen-dining', 2, 1, 3, NOW(), NOW()),
('Garden Tools', 'garden-tools', 3, 1, 3, NOW(), NOW()),
('Car Care & Detailing', 'car-care-detailing', 1, 1, 6, NOW(), NOW()),
('Car Electronics', 'car-electronics', 2, 1, 6, NOW(), NOW()),
('Auto Parts', 'auto-parts', 3, 1, 6, NOW(), NOW()),
('Skincare', 'skincare', 1, 1, 7, NOW(), NOW()),
('Makeup', 'makeup', 2, 1, 7, NOW(), NOW()),
('Hair Care', 'hair-care', 3, 1, 7, NOW(), NOW()),
('Board Games', 'board-games', 1, 1, 8, NOW(), NOW()),
('Video Games', 'video-games', 2, 1, 8, NOW(), NOW()),
('Educational Toys', 'educational-toys', 3, 1, 8, NOW(), NOW())`;

    const allStatements = [createTableSQL, insertDataSQL];
    
    console.log(`🚀 Executing ${allStatements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < allStatements.length; i++) {
      const statement = allStatements[i];
      try {
        console.log(`📋 Executing statement ${i + 1}/${allStatements.length}...`);
        if (i === 0) {
          console.log('🏗️  Creating sub_categories table...');
        } else {
          console.log('📥 Inserting sample data...');
        }
        await connection.execute(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`⚠️  Table already exists, skipping creation...`);
        } else if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Data already exists, skipping insertion...`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          throw error;
        }
      }
    }

    console.log('🎉 Migration completed successfully!');
    
    // Verify the table was created
    console.log('🔍 Verifying table creation...');
    const [rows] = await connection.execute('SHOW TABLES LIKE "sub_categories"');
    if (rows.length > 0) {
      console.log('✅ sub_categories table exists');
      
      // Check the data
      const [dataRows] = await connection.execute('SELECT COUNT(*) as count FROM sub_categories');
      console.log(`📊 Found ${dataRows[0].count} sub categories`);
      
      // Show sample data
      const [sampleData] = await connection.execute('SELECT * FROM sub_categories LIMIT 3');
      console.log('📋 Sample data:');
      sampleData.forEach(row => {
        console.log(`  - ${row.name} (ID: ${row.id}, Priority: ${row.priority})`);
      });
    } else {
      console.log('❌ sub_categories table not found');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the migration
console.log('🚀 Starting Sub Category Migration...');
console.log('=====================================');
runMigration();
