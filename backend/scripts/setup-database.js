const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up Shopzeo database...\n');

  try {
    // Create connection without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'shopzeo_db';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created/verified`);

    // Use the database
    await connection.execute(`USE \`${dbName}\``);
    console.log(`✅ Using database '${dbName}'`);

    // Create tables manually (since we have migrations)
    console.log('\n📋 Creating database tables...');

    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'vendor', 'customer', 'delivery') DEFAULT 'customer',
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        email_verified_at DATETIME,
        phone_verified_at DATETIME,
        last_login_at DATETIME,
        profile_image VARCHAR(500),
        date_of_birth DATE,
        gender ENUM('male', 'female', 'other'),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100) DEFAULT 'India',
        postal_code VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_phone (phone),
        INDEX idx_role (role),
        INDEX idx_is_active (is_active),
        INDEX idx_is_verified (is_verified)
      )
    `);
    console.log('✅ Users table created');

    // Categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image VARCHAR(500),
        sort_order INT DEFAULT 0,
        is_home_category BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        parent_id INT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_parent_id (parent_id),
        INDEX idx_is_active (is_active),
        INDEX idx_is_home_category (is_home_category),
        INDEX idx_sort_order (sort_order),
        FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    console.log('✅ Categories table created');

    // Stores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        logo VARCHAR(500),
        banner VARCHAR(500),
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        gst_number VARCHAR(20),
        gst_percentage DECIMAL(5,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        is_verified BOOLEAN DEFAULT FALSE,
        rating DECIMAL(3,2) DEFAULT 0,
        total_products INT DEFAULT 0,
        total_orders INT DEFAULT 0,
        total_revenue DECIMAL(15,2) DEFAULT 0,
        commission_rate DECIMAL(5,2) DEFAULT 15,
        owner_id INT NOT NULL,
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_owner_id (owner_id),
        INDEX idx_is_active (is_active),
        INDEX idx_is_verified (is_verified),
        INDEX idx_rating (rating),
        INDEX idx_gst_number (gst_number),
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    console.log('✅ Stores table created');

    // Products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_code VARCHAR(100) NOT NULL UNIQUE,
        amazon_asin VARCHAR(20),
        name VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        sku_id VARCHAR(100),
        description TEXT,
        selling_price DECIMAL(10,2) NOT NULL,
        mrp DECIMAL(10,2),
        cost_price DECIMAL(10,2),
        quantity INT DEFAULT 0,
        packaging_length DECIMAL(8,2),
        packaging_breadth DECIMAL(8,2),
        packaging_height DECIMAL(8,2),
        packaging_weight DECIMAL(8,2),
        gst_percentage DECIMAL(5,2) DEFAULT 0,
        image_1 VARCHAR(500),
        image_2 VARCHAR(500),
        image_3 VARCHAR(500),
        image_4 VARCHAR(500),
        image_5 VARCHAR(500),
        image_6 VARCHAR(500),
        image_7 VARCHAR(500),
        image_8 VARCHAR(500),
        image_9 VARCHAR(500),
        image_10 VARCHAR(500),
        video_1 VARCHAR(500),
        video_2 VARCHAR(500),
        size_chart VARCHAR(500),
        product_type VARCHAR(100),
        size VARCHAR(100),
        color VARCHAR(100),
        return_conditions TEXT,
        hsn_code VARCHAR(20),
        custom_attributes JSON,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        store_id INT NOT NULL,
        category_id INT,
        sub_category_id INT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_product_code (product_code),
        INDEX idx_slug (slug),
        INDEX idx_store_id (store_id),
        INDEX idx_category_id (category_id),
        INDEX idx_sub_category_id (sub_category_id),
        INDEX idx_is_active (is_active),
        INDEX idx_is_featured (is_featured),
        INDEX idx_selling_price (selling_price),
        INDEX idx_gst_percentage (gst_percentage),
        INDEX idx_hsn_code (hsn_code),
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (sub_category_id) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);
    console.log('✅ Products table created');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    await connection.execute(`
      INSERT IGNORE INTO users (first_name, last_name, email, password, role, is_active, is_verified)
      VALUES ('Admin', 'User', 'admin@shopzeo.com', ?, 'admin', TRUE, TRUE)
    `, [adminPassword]);
    console.log('✅ Admin user created (admin@shopzeo.com / admin123)');

    // Create sample categories
    await connection.execute(`
      INSERT IGNORE INTO categories (name, slug, description, is_home_category, sort_order)
      VALUES 
        ('Electronics', 'electronics', 'Electronic gadgets and devices', TRUE, 1),
        ('Fashion', 'fashion', 'Clothing and accessories', TRUE, 2),
        ('Home & Garden', 'home-garden', 'Home improvement and garden items', TRUE, 3),
        ('Sports', 'sports', 'Sports equipment and accessories', TRUE, 4),
        ('Books', 'books', 'Books and educational materials', TRUE, 5)
    `);
    console.log('✅ Sample categories created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Database Summary:');
    console.log(`   - Database: ${dbName}`);
    console.log(`   - Tables: users, categories, stores, products`);
    console.log(`   - Admin User: admin@shopzeo.com / admin123`);
    console.log('\n🔗 Next Steps:');
    console.log('   1. Start the backend server: npm start');
    console.log('   2. Start the frontend: npm run dev');
    console.log('   3. Login to admin panel with admin@shopzeo.com / admin123');
    console.log('   4. Create stores and manage vendors');

    await connection.end();

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check MySQL is running');
    console.log('   2. Verify database credentials in .env file');
    console.log('   3. Ensure MySQL user has CREATE privileges');
    process.exit(1);
  }
}

// Run setup
setupDatabase();
