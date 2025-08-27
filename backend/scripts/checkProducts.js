const { sequelize } = require('../config/database');

async function checkProducts() {
  try {
    console.log('🔍 Checking products in database...');
    
    // Check if products table exists and has data
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM products');
    console.log('📊 Total products in database:', results[0].count);
    
    if (results[0].count > 0) {
      // Get sample products
      const [products] = await sequelize.query('SELECT id, product_code, name, store_id, category_id, sub_category_id FROM products LIMIT 5');
      console.log('📋 Sample products:');
      products.forEach(product => {
        console.log(`  - ID: ${product.id}, Code: ${product.product_code}, Name: ${product.name}, Store: ${product.store_id}, Category: ${product.category_id}, SubCategory: ${product.sub_category_id}`);
      });
    }
    
    // Check stores
    const [storeResults] = await sequelize.query('SELECT COUNT(*) as count FROM stores');
    console.log('📊 Total stores in database:', storeResults[0].count);
    
    // Check categories
    const [categoryResults] = await sequelize.query('SELECT COUNT(*) as count FROM categories');
    console.log('📊 Total categories in database:', categoryResults[0].count);
    
    // Check subcategories
    const [subCategoryResults] = await sequelize.query('SELECT COUNT(*) as count FROM sub_categories');
    console.log('📊 Total subcategories in database:', subCategoryResults[0].count);
    
  } catch (error) {
    console.error('❌ Error checking products:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
checkProducts();
