const { sequelize } = require('../config/database');

async function checkTableStructure() {
  try {
    console.log('🔍 Checking table structures...');
    
    // Check products table structure
    console.log('\n📋 Products table structure:');
    const [productFields] = await sequelize.query('DESCRIBE products');
    productFields.forEach(field => {
      console.log(`  - ${field.Field}: ${field.Type} ${field.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${field.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check stores table structure
    console.log('\n📋 Stores table structure:');
    const [storeFields] = await sequelize.query('DESCRIBE stores');
    storeFields.forEach(field => {
      console.log(`  - ${field.Field}: ${field.Type} ${field.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${field.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check if there are any foreign key constraints
    console.log('\n🔗 Foreign key constraints:');
    const [constraints] = await sequelize.query(`
      SELECT 
        CONSTRAINT_NAME,
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM information_schema.KEY_COLUMN_USAGE 
      WHERE REFERENCED_TABLE_NAME IS NOT NULL 
      AND TABLE_SCHEMA = 'shopzeo_db'
    `);
    
    if (constraints.length > 0) {
      constraints.forEach(constraint => {
        console.log(`  - ${constraint.TABLE_NAME}.${constraint.COLUMN_NAME} -> ${constraint.REFERENCED_TABLE_NAME}.${constraint.REFERENCED_COLUMN_NAME}`);
      });
    } else {
      console.log('  No foreign key constraints found');
    }
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
checkTableStructure();
