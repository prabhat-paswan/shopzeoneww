const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shopzeo_db'
};

async function checkAndPopulate() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');

    // Check brands table structure
    console.log('\n🔍 Checking brands table structure...');
    const [brandColumns] = await connection.execute('DESCRIBE brands');
    console.log('📋 Brands table columns:');
    brandColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Check brands table
    console.log('\n🔍 Checking brands table...');
    const [brandTables] = await connection.execute('SHOW TABLES LIKE "brands"');
    if (brandTables.length > 0) {
      console.log('✅ Brands table exists');
      
      const [brandCount] = await connection.execute('SELECT COUNT(*) as count FROM brands');
      console.log(`📊 Brands table has ${brandCount[0].count} records`);
      
      if (brandCount[0].count === 0) {
        console.log('📝 Inserting sample brands...');
        const sampleBrands = [
          ['Samsung', 'samsung', 'Leading electronics and home appliance brand', 'uploads/brands/samsung-logo.png', 'uploads/brands/samsung-banner.jpg', 'https://samsung.com', 1, 1, 'Samsung Electronics', 'Leading electronics and home appliance brand', 'samsung, electronics, appliances'],
          ['LG', 'lg', 'Innovative home appliances and electronics', 'uploads/brands/lg-logo.png', 'uploads/brands/lg-banner.jpg', 'https://lg.com', 1, 2, 'LG Electronics', 'Innovative home appliances and electronics', 'lg, electronics, appliances'],
          ['Whirlpool', 'whirlpool', 'Trusted home appliance manufacturer', 'uploads/brands/whirlpool-logo.png', 'uploads/brands/whirlpool-banner.jpg', 'https://whirlpool.com', 1, 3, 'Whirlpool Appliances', 'Trusted home appliance manufacturer', 'whirlpool, appliances, home'],
          ['Bosch', 'bosch', 'Premium German engineering for home appliances', 'uploads/brands/bosch-logo.png', 'uploads/brands/bosch-banner.jpg', 'https://bosch.com', 1, 4, 'Bosch Home Appliances', 'Premium German engineering for home appliances', 'bosch, german, premium, appliances'],
          ['Philips', 'philips', 'Quality lighting and home care products', 'uploads/brands/philips-logo.png', 'uploads/brands/philips-banner.jpg', 'https://philips.com', 1, 5, 'Philips Home Products', 'Quality lighting and home care products', 'philips, lighting, home care']
        ];
        
        for (const brand of sampleBrands) {
          await connection.execute(
            'INSERT INTO brands (name, slug, description, logo, banner, website, is_active, sort_order, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            brand
          );
        }
        console.log('✅ Sample brands inserted successfully');
      }
    }

    // Check banners table structure
    console.log('\n🔍 Checking banners table structure...');
    const [bannerColumns] = await connection.execute('DESCRIBE banners');
    console.log('📋 Banners table columns:');
    bannerColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Check banners table
    console.log('\n🔍 Checking banners table...');
    const [bannerTables] = await connection.execute('SHOW TABLES LIKE "banners"');
    if (bannerTables.length > 0) {
      console.log('✅ Banners table exists');
      
      const [bannerCount] = await connection.execute('SELECT COUNT(*) as count FROM banners');
      console.log(`📊 Banners table has ${bannerCount[0].count} records`);
      
      if (bannerCount[0].count === 0) {
        console.log('📝 Inserting sample banners...');
        const sampleBanners = [
          ['Smart Home Smart Savings!', 'Unmissable deals on all your home appliance needs.', 'Get the best deals on premium home appliances including refrigerators, washing machines, and kitchen essentials.', 'uploads/banners/sample-banner-1.jpg', 'main_banner', 'Get Yours', '/products/home-appliances', 1, 1, 1],
          ['Electronics Sale', 'Up to 50% off on Electronics', 'Amazing discounts on smartphones, laptops, and other electronic devices.', 'uploads/banners/sample-banner-2.jpg', 'category_banner', 'Shop Now', '/products/electronics', 1, 1, 2],
          ['Kitchen Appliances', 'Transform Your Kitchen', 'Premium quality kitchen appliances for modern homes.', 'uploads/banners/sample-banner-3.jpg', 'product_banner', 'Explore', '/products/kitchen-appliances', 1, 0, 3]
        ];
        
        for (const banner of sampleBanners) {
          await connection.execute(
            'INSERT INTO banners (title, subtitle, description, image, banner_type, button_text, button_url, is_active, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            banner
          );
        }
        console.log('✅ Sample banners inserted successfully');
      }
    }

    // Final verification
    console.log('\n🔍 Final verification...');
    const [finalBrandCount] = await connection.execute('SELECT COUNT(*) as count FROM brands');
    const [finalBannerCount] = await connection.execute('SELECT COUNT(*) as count FROM banners');
    console.log(`📊 Brands: ${finalBrandCount[0].count} records`);
    console.log(`📊 Banners: ${finalBannerCount[0].count} records`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.sql) {
      console.error('SQL Error:', error.sql);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run if this script is executed directly
if (require.main === module) {
  checkAndPopulate();
}

module.exports = { checkAndPopulate };
