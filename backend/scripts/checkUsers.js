const { sequelize } = require('../config/database');

async function checkUsers() {
  try {
    console.log('👥 Checking users in database...');
    
    // Check users table structure first
    console.log('\n📋 Users table structure:');
    const [userFields] = await sequelize.query('DESCRIBE users');
    userFields.forEach(field => {
      console.log(`  - ${field.Field}: ${field.Type} ${field.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${field.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check if users table exists and has data
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    console.log('\n📊 Total users in database:', results[0].count);
    
    if (results[0].count > 0) {
      // Get sample users with correct field names
      const [users] = await sequelize.query('SELECT * FROM users LIMIT 1');
      console.log('\n📋 Sample user:');
      console.log(JSON.stringify(users[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
checkUsers();
