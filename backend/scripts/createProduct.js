const { sequelize } = require('../config/database');

async function createProduct() {
  try {
    console.log('📝 Creating test product...');
    
    // Use existing store ID
    const existingStoreId = 'ce32fe90-7eaa-11f0-a328-f5704f3e47ab';
    console.log('🏪 Using existing store ID:', existingStoreId);
    
    // Create a test product
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
        1, '${existingStoreId}', 100.00, 0.00, 0, 'Test Product',
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
    
    // Check the final count
    const [productCount] = await sequelize.query('SELECT COUNT(*) as count FROM products');
    console.log('📊 Total products now:', productCount[0].count);
    
    // Show the created product
    const [products] = await sequelize.query('SELECT id, name, product_code, store_id FROM products WHERE product_code = "TEST001"');
    if (products.length > 0) {
      console.log('📋 Created product:', products[0]);
    }
    
  } catch (error) {
    console.error('❌ Error creating product:', error.message);
    
    if (error.sql) {
      console.error('SQL Error:', error.sql);
    }
  } finally {
    await sequelize.close();
  }
}

// Run the script
createProduct();
