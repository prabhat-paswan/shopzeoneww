const { sequelize } = require('../config/database');

async function createTestData() {
  try {
    console.log('🧪 Creating test data...');
    
    // First, create a test store
    console.log('📝 Creating test store...');
    const [storeResult] = await sequelize.query(`
      INSERT INTO stores (
        id, name, slug, description, phone, email, address,
        rating, total_orders, commission_rate, created_at, updated_at,
        owner_id, gst_number, gst_percentage, is_active, is_verified,
        total_products, total_revenue, meta_title, meta_description, meta_keywords
      ) VALUES (
        UUID(), 'Test Store', 'test-store', 'A test store for testing',
        '+1234567890', 'test@store.com', '123 Test Street',
        0.00, 0, 15.00, NOW(), NOW(),
        '97c7cc00-64b1-46d1-9b1c-a3cb8dc24ce3', 'GST123', 18.00, 1, 1,
        0, 0.00, 'Test Store', 'Test store description', 'test, store'
      )
    `);
    
    console.log('✅ Store created successfully!');
    
    // Get the store ID
    const [stores] = await sequelize.query('SELECT id FROM stores WHERE name = "Test Store" LIMIT 1');
    const storeId = stores[0].id;
    console.log('🏪 Store ID:', storeId);
    
    // Now create a test product
    console.log('📝 Creating test product...');
    const [productResult] = await sequelize.query(`
      INSERT INTO products (
        id, name, slug, description, category_id, store_id, 
        cost_price, rating, total_reviews, meta_title, 
        meta_description, meta_keywords, created_at, updated_at,
        product_code, amazon_asin, sku_id, selling_price, mrp, 
        quantity, packaging_length, packaging_breadth, 
        packaging_height, packaging_weight, gst_percentage,
        image_1, image_2, product_type, size, colour,
        return_exchange_condition, visibility, size_chart,
        hsn_code, is_active, is_featured, is_home_product,
        total_sold, sub_category_id
      ) VALUES (
        UUID(), 'Test Product', 'test-product', 'Test description',
        1, '${storeId}', 100.00, 0.00, 0, 'Test Product',
        'Test description', 'test', NOW(), NOW(),
        'TEST001', 'B08TEST', 'SKUTEST', 150.00, 200.00,
        10, 10.0, 5.0, 2.0, 0.5, 18,
        'https://example.com/test1.jpg', 'https://example.com/test2.jpg',
        'Test Type', 'M', 'Blue', '7 days return', 1,
        'https://example.com/sizechart.jpg', '1234',
        1, 0, 0, 0, 19
      )
    `);
    
    console.log('✅ Product created successfully!');
    
    // Check the final counts
    const [productCount] = await sequelize.query('SELECT COUNT(*) as count FROM products');
    const [storeCount] = await sequelize.query('SELECT COUNT(*) as count FROM stores');
    
    console.log('📊 Final counts:');
    console.log('  - Products:', productCount[0].count);
    console.log('  - Stores:', storeCount[0].count);
    
  } catch (error) {
    console.error('❌ Error creating test data:', error.message);
    
    if (error.sql) {
      console.error('SQL Error:', error.sql);
    }
  } finally {
    await sequelize.close();
  }
}

// Run the script
createTestData();
