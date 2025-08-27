const { sequelize } = require('../config/database');

async function checkCategories() {
  try {
    console.log('🏷️ Checking categories and subcategories...');
    
    // Check categories
    console.log('\n📋 Categories:');
    const [categories] = await sequelize.query('SELECT id, name FROM categories LIMIT 5');
    categories.forEach(cat => {
      console.log(`  - ID: ${cat.id}, Name: ${cat.name}`);
    });
    
    // Check subcategories
    console.log('\n📋 Subcategories:');
    const [subcategories] = await sequelize.query('SELECT id, name, category_id FROM sub_categories LIMIT 10');
    subcategories.forEach(subcat => {
      console.log(`  - ID: ${subcat.id}, Name: ${subcat.name}, Category ID: ${subcat.category_id}`);
    });
    
    // Check if the IDs I'm using exist
    console.log('\n🔍 Checking specific IDs:');
    const [cat1] = await sequelize.query('SELECT id, name FROM categories WHERE id = 1');
    if (cat1.length > 0) {
      console.log(`  ✅ Category ID 1 exists: ${cat1[0].name}`);
    } else {
      console.log('  ❌ Category ID 1 does not exist');
    }
    
    const [subcat1] = await sequelize.query('SELECT id, name FROM sub_categories WHERE id = 1');
    if (subcat1.length > 0) {
      console.log(`  ✅ Subcategory ID 1 exists: ${subcat1[0].name}`);
    } else {
      console.log('  ❌ Subcategory ID 1 does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error checking categories:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
checkCategories();
