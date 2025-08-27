const { sequelize } = require('../config/database');

async function testInsert() {
  try {
    console.log('🧪 Testing product insertion...');
    
    // Try to insert a simple product with the actual database structure
    const [result] = await sequelize.query(`
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
        1, UUID(), 100.00, 0.00, 0, 'Test Product',
        'Test description', 'test', NOW(), NOW(),
        'TEST001', 'B08TEST', 'SKUTEST', 150.00, 200.00,
        10, 10.0, 5.0, 2.0, 0.5, 18,
        'https://example.com/test1.jpg', 'https://example.com/test2.jpg',
        'Test Type', 'M', 'Blue', '7 days return', 1,
        'https://example.com/sizechart.jpg', '1234',
        1, 0, 0, 0, 1
      )
    `);
    
    console.log('✅ Product inserted successfully!');
    console.log('Insert ID:', result.insertId);
    
    // Check if the product was actually inserted
    const [products] = await sequelize.query('SELECT COUNT(*) as count FROM products');
    console.log('📊 Total products now:', products[0].count);
    
  } catch (error) {
    console.error('❌ Error inserting product:', error.message);
    
    // Show the specific error details
    if (error.sql) {
      console.error('SQL Error:', error.sql);
    }
  } finally {
    await sequelize.close();
  }
}

// Run the script
testInsert();
