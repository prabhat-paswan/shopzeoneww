const { sequelize } = require('../config/database');

async function checkStores() {
  try {
    console.log('🏪 Checking stores in database...');
    
    // Check stores table structure
    console.log('\n📋 Stores table structure:');
    const [storeFields] = await sequelize.query('DESCRIBE stores');
    storeFields.forEach(field => {
      console.log(`  - ${field.Field}: ${field.Type} ${field.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${field.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });
    
    // Check if stores table exists and has data
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM stores');
    console.log('\n📊 Total stores in database:', results[0].count);
    
    if (results[0].count > 0) {
      // Get sample stores
      const [stores] = await sequelize.query('SELECT id, name, slug, owner_id FROM stores LIMIT 5');
      console.log('\n📋 Sample stores:');
      stores.forEach(store => {
        console.log(`  - ID: ${store.id}, Name: ${store.name}, Slug: ${store.slug}, Owner: ${store.owner_id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking stores:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
checkStores();
