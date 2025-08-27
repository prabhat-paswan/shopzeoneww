const mysql = require('mysql2/promise');

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

    console.log('🚀 Executing 2 SQL statements...');

    // 1. Create sub_categories table with correct field names
    const createTableSQL = `CREATE TABLE IF NOT EXISTS \`sub_categories\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL COMMENT 'Sub category name in English',
  \`slug\` varchar(255) NOT NULL COMMENT 'URL-friendly sub category name',
  \`description\` text DEFAULT NULL COMMENT 'Sub category description',
  \`image\` varchar(255) DEFAULT NULL COMMENT 'Sub category image',
  \`priority\` int(11) DEFAULT 0 COMMENT 'Display priority order',
  \`is_active\` tinyint(1) DEFAULT 1 COMMENT 'Sub category status (0=Inactive, 1=Active)',
  \`category_id\` int(11) NOT NULL COMMENT 'Parent category ID',
  \`meta_title\` varchar(60) DEFAULT NULL COMMENT 'SEO meta title',
  \`meta_description\` varchar(160) DEFAULT NULL COMMENT 'SEO meta description',
  \`meta_keywords\` varchar(255) DEFAULT NULL COMMENT 'SEO meta keywords',
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_sub_categories_slug\` (\`slug\`),
  KEY \`idx_sub_categories_category_id\` (\`category_id\`),
  KEY \`idx_sub_categories_is_active\` (\`is_active\`),
  KEY \`idx_sub_categories_priority\` (\`priority\`),
  KEY \`idx_sub_categories_created_at\` (\`created_at\`),
  KEY \`idx_sub_categories_updated_at\` (\`updated_at\`),
  CONSTRAINT \`fk_sub_categories_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Product sub categories table'`;

    // 2. Insert sample data
    const insertDataSQL = `INSERT INTO \`sub_categories\` (\`name\`, \`slug\`, \`description\`, \`priority\`, \`is_active\`, \`category_id\`, \`created_at\`, \`updated_at\`) VALUES
('Smartphones', 'smartphones', 'Mobile phones and smartphones', 1, 1, 1, NOW(), NOW()),
('Laptops', 'laptops', 'Portable computers and laptops', 2, 1, 1, NOW(), NOW()),
('Tablets', 'tablets', 'Tablet computers and iPads', 3, 1, 1, NOW(), NOW()),
('Men\\'s Clothing', 'mens-clothing', 'Clothing for men', 1, 1, 2, NOW(), NOW()),
('Women\\'s Clothing', 'womens-clothing', 'Clothing for women', 2, 1, 2, NOW(), NOW()),
('Kids\\'s Clothing', 'kids-clothing', 'Clothing for children', 3, 1, 2, NOW(), NOW()),
('Furniture', 'furniture', 'Home and office furniture', 1, 1, 3, NOW(), NOW()),
('Kitchen & Dining', 'kitchen-dining', 'Kitchen and dining accessories', 2, 1, 3, NOW(), NOW()),
('Garden Tools', 'garden-tools', 'Tools for gardening', 3, 1, 3, NOW(), NOW()),
('Car Care & Detailing', 'car-care-detailing', 'Car cleaning and maintenance products', 1, 1, 6, NOW(), NOW()),
('Car Electronics', 'car-electronics', 'Electronic accessories for cars', 2, 1, 6, NOW(), NOW()),
('Auto Parts', 'auto-parts', 'Automotive parts and accessories', 3, 1, 6, NOW(), NOW()),
('Skincare', 'skincare', 'Skin care products', 1, 1, 7, NOW(), NOW()),
('Makeup', 'makeup', 'Cosmetics and makeup products', 2, 1, 7, NOW(), NOW()),
('Hair Care', 'hair-care', 'Hair care and styling products', 3, 1, 7, NOW(), NOW()),
('Board Games', 'board-games', 'Traditional board games', 1, 1, 8, NOW(), NOW()),
('Video Games', 'video-games', 'Video games and consoles', 2, 1, 8, NOW(), NOW()),
('Educational Toys', 'educational-toys', 'Educational and learning toys', 3, 1, 8, NOW(), NOW())`;

    const allStatements = [createTableSQL, insertDataSQL];
    
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
console.log('🚀 Starting Sub Category Migration (Fixed)...');
console.log('=============================================');
runMigration();
