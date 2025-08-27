const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shopzeo_db'
};

async function migrateAdminTable() {
  let connection;
  
  try {
    console.log('🚀 Migrating Admin table to existing database...\n');
    
    // Connect to existing database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    });

    console.log(`✅ Connected to existing database: ${dbConfig.database}`);

    // Check if admin table already exists
    const [existingTables] = await connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = ? AND table_name = 'admins'
    `, [dbConfig.database]);

    if (existingTables[0].count > 0) {
      console.log('ℹ️ Admin table already exists. Checking structure...');
      
      // Check table structure
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM information_schema.columns 
        WHERE table_schema = ? AND table_name = 'admins'
        ORDER BY ORDINAL_POSITION
      `, [dbConfig.database]);

      console.log('📋 Current admin table structure:');
      columns.forEach(col => {
        console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });

      // Check if we need to add missing columns
      const requiredColumns = [
        'id', 'email', 'password', 'name', 'role', 'isActive', 
        'lastLogin', 'loginAttempts', 'lockedUntil', 'createdAt', 'updatedAt'
      ];

      const existingColumnNames = columns.map(col => col.COLUMN_NAME);
      const missingColumns = requiredColumns.filter(col => !existingColumnNames.includes(col));

      if (missingColumns.length > 0) {
        console.log(`\n⚠️ Missing columns: ${missingColumns.join(', ')}`);
        console.log('🔄 Adding missing columns...');
        
        // Add missing columns
        for (const column of missingColumns) {
          try {
            let alterSQL = '';
            switch (column) {
              case 'id':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY';
                break;
              case 'email':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN email VARCHAR(255) NOT NULL';
                break;
              case 'password':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN password VARCHAR(255) NOT NULL';
                break;
              case 'name':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN name VARCHAR(100) NOT NULL';
                break;
              case 'role':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN role ENUM("super_admin", "admin") DEFAULT "admin"';
                break;
              case 'isActive':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN isActive BOOLEAN DEFAULT true';
                break;
              case 'lastLogin':
                alterSQL = 'ALTER TABLE admins ADD COLUMN lastLogin DATETIME NULL';
                break;
              case 'loginAttempts':
                alterSQL = 'ALTER TABLE admins ADD COLUMN loginAttempts INT DEFAULT 0';
                break;
              case 'lockedUntil':
                alterSQL = 'ALTER TABLE admins ADD COLUMN lockedUntil DATETIME NULL';
                break;
              case 'createdAt':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP';
                break;
              case 'updatedAt':
                alterSQL = 'ALTER TABLE admins MODIFY COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';
                break;
            }
            
            if (alterSQL) {
              await connection.execute(alterSQL);
              console.log(`   ✅ Added/modified column: ${column}`);
            }
          } catch (error) {
            console.log(`   ⚠️ Column ${column} already exists or error: ${error.message}`);
          }
        }
      } else {
        console.log('✅ Admin table structure is correct');
      }

    } else {
      // Create admin table
      console.log('📋 Creating admin table...');
      
      const createAdminTable = `
        CREATE TABLE admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          role ENUM('super_admin', 'admin') DEFAULT 'admin',
          isActive BOOLEAN DEFAULT true,
          lastLogin DATETIME NULL,
          loginAttempts INT DEFAULT 0,
          lockedUntil DATETIME NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_role (role),
          INDEX idx_isActive (isActive)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;

      await connection.execute(createAdminTable);
      console.log('✅ Admin table created successfully');
    }

    // Check if admin user exists
    const [existingAdmins] = await connection.execute(
      'SELECT COUNT(*) as count FROM admins WHERE email = ?',
      ['admin@shopzeo.com']
    );

    if (existingAdmins[0].count === 0) {
      // Create default admin user
      console.log('\n👤 Creating default admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await connection.execute(`
        INSERT INTO admins (email, password, name, role, isActive) 
        VALUES (?, ?, ?, ?, ?)
      `, ['admin@shopzeo.com', hashedPassword, 'Super Admin', 'super_admin', true]);

      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@shopzeo.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('\nℹ️ Admin user already exists');
    }

    // Add indexes if they don't exist
    console.log('\n🔍 Adding/verifying indexes...');
    
    try {
      await connection.execute('CREATE INDEX IF NOT EXISTS idx_email ON admins(email)');
      console.log('   ✅ Email index verified');
    } catch (error) {
      console.log('   ℹ️ Email index already exists');
    }

    try {
      await connection.execute('CREATE INDEX IF NOT EXISTS idx_role ON admins(role)');
      console.log('   ✅ Role index verified');
    } catch (error) {
      console.log('   ℹ️ Role index already exists');
    }

    try {
      await connection.execute('CREATE INDEX IF NOT EXISTS idx_isActive ON admins(isActive)');
      console.log('   ✅ isActive index verified');
    } catch (error) {
      console.log('   ℹ️ isActive index already exists');
    }

    console.log('\n🎉 Admin table migration completed successfully!');
    console.log(`🌐 Database: ${dbConfig.database}`);
    console.log(`🔗 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log('\n📋 Next Steps:');
    console.log('   1. Start backend server: npm start');
    console.log('   2. Test admin login: admin@shopzeo.com / admin123');
    console.log('   3. Access admin panel at: /admin/login');

  } catch (error) {
    console.error('❌ Admin table migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAdminTable();
}

module.exports = { migrateAdminTable };
