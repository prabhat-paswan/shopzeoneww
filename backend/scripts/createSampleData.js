const { sequelize } = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Store = require('../models/Store');
const Product = require('../models/Product');

async function createSampleData() {
  try {
    console.log('🔄 Starting to create sample data...');
    
    // Create sample categories if they don't exist
    const categories = await Category.bulkCreate([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        image: null,
        parent_id: null,
        level: 1,
        sort_order: 1,
        is_active: true,
        meta_title: 'Electronics - Best Deals',
        meta_description: 'Find the best electronics deals',
        meta_keywords: 'electronics, gadgets, devices'
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        image: null,
        parent_id: null,
        level: 1,
        sort_order: 2,
        is_active: true,
        meta_title: 'Clothing - Fashion Store',
        meta_description: 'Latest fashion trends',
        meta_keywords: 'clothing, fashion, apparel'
      }
    ], { ignoreDuplicates: true });
    
    console.log('✅ Categories created:', categories.length);
    
    // Create sample subcategories
    const subCategories = await SubCategory.bulkCreate([
      {
        name: 'Smartphones',
        slug: 'smartphones',
        priority: 1,
        is_active: true,
        category_id: 1,
        meta_title: 'Smartphones',
        meta_description: 'Latest smartphones',
        meta_keywords: 'smartphones, mobile, phones'
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        priority: 2,
        is_active: true,
        category_id: 1,
        meta_title: 'Laptops',
        meta_description: 'Best laptops',
        meta_keywords: 'laptops, computers'
      },
      {
        name: 'Men\'s Wear',
        slug: 'mens-wear',
        priority: 1,
        is_active: true,
        category_id: 2,
        meta_title: 'Men\'s Clothing',
        meta_description: 'Men\'s fashion',
        meta_keywords: 'men, clothing, fashion'
      },
      {
        name: 'Women\'s Wear',
        slug: 'womens-wear',
        priority: 2,
        is_active: true,
        category_id: 2,
        meta_title: 'Women\'s Clothing',
        meta_description: 'Women\'s fashion',
        meta_keywords: 'women, clothing, fashion'
      }
    ], { ignoreDuplicates: true });
    
    console.log('✅ Subcategories created:', subCategories.length);
    
    // Create sample stores
    const stores = await Store.bulkCreate([
      {
        name: 'TechStore',
        slug: 'techstore',
        description: 'Your one-stop shop for all things tech',
        logo: null,
        banner: null,
        address: '123 Tech Street, Silicon Valley',
        phone: '+1-555-0123',
        email: 'info@techstore.com',
        website: 'https://techstore.com',
        is_verified: true,
        is_active: true,
        owner_id: 1
      },
      {
        name: 'FashionHub',
        slug: 'fashionhub',
        description: 'Trendy fashion for everyone',
        logo: null,
        banner: null,
        address: '456 Fashion Avenue, Style City',
        phone: '+1-555-0456',
        email: 'info@fashionhub.com',
        website: 'https://fashionhub.com',
        is_verified: true,
        is_active: true,
        owner_id: 1
      }
    ], { ignoreDuplicates: true });
    
    console.log('✅ Stores created:', stores.length);
    
    // Create sample products
    const products = await Product.bulkCreate([
      {
        product_code: 'PROD001',
        amazon_asin: 'B08N5WRWNW',
        sku_id: 'SKU001',
        name: 'iPhone 12 Pro',
        description: 'Latest iPhone with advanced features and Pro camera system',
        selling_price: 999.99,
        mrp: 1199.99,
        cost_price: 800.00,
        quantity: 50,
        packaging_length: 15.0,
        packaging_breadth: 7.5,
        packaging_height: 0.8,
        packaging_weight: 0.189,
        gst_percentage: 18,
        image_1: 'https://example.com/iphone12-1.jpg',
        image_2: 'https://example.com/iphone12-2.jpg',
        image_3: '',
        image_4: '',
        image_5: '',
        image_6: '',
        image_7: '',
        image_8: '',
        image_9: '',
        image_10: '',
        video_1: 'https://example.com/iphone12-demo.mp4',
        video_2: '',
        size_chart: '',
        product_type: 'Smartphone',
        size: 'Standard',
        colour: 'Pacific Blue',
        return_exchange_condition: '7 days return policy',
        hsn_code: '8517',
        custom_attributes: '5G, A14 Bionic, Pro camera system',
        is_active: true,
        is_featured: true,
        store_id: 1,
        category_id: 1,
        sub_category_id: 1
      },
      {
        product_code: 'PROD002',
        amazon_asin: 'B08N5WRWNW',
        sku_id: 'SKU002',
        name: 'MacBook Pro 13"',
        description: 'Powerful laptop for professionals',
        selling_price: 1299.99,
        mrp: 1499.99,
        cost_price: 1100.00,
        quantity: 25,
        packaging_length: 30.4,
        packaging_breadth: 21.2,
        packaging_height: 1.56,
        packaging_weight: 1.3,
        gst_percentage: 18,
        image_1: 'https://example.com/macbook-1.jpg',
        image_2: 'https://example.com/macbook-2.jpg',
        image_3: '',
        image_4: '',
        image_5: '',
        image_6: '',
        image_7: '',
        image_8: '',
        image_9: '',
        image_10: '',
        video_1: '',
        video_2: '',
        size_chart: '',
        product_type: 'Laptop',
        size: '13 inch',
        colour: 'Space Gray',
        return_exchange_condition: '14 days return policy',
        hsn_code: '8471',
        custom_attributes: 'M1 Chip, 8GB RAM, 256GB SSD',
        is_active: true,
        is_featured: false,
        store_id: 1,
        category_id: 1,
        sub_category_id: 2
      },
      {
        product_code: 'PROD003',
        amazon_asin: 'B08N5WRWNW',
        sku_id: 'SKU003',
        name: 'Men\'s Casual T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        selling_price: 29.99,
        mrp: 39.99,
        cost_price: 20.00,
        quantity: 100,
        packaging_length: 70,
        packaging_breadth: 50,
        packaging_height: 0.5,
        packaging_weight: 0.15,
        gst_percentage: 12,
        image_1: 'https://example.com/tshirt-1.jpg',
        image_2: 'https://example.com/tshirt-2.jpg',
        image_3: '',
        image_4: '',
        image_5: '',
        image_6: '',
        image_7: '',
        image_8: '',
        image_9: '',
        image_10: '',
        video_1: '',
        video_2: '',
        size_chart: 'https://example.com/sizechart.jpg',
        product_type: 'T-Shirt',
        size: 'M',
        colour: 'Navy Blue',
        return_exchange_condition: '30 days return policy',
        hsn_code: '6104',
        custom_attributes: '100% Cotton, Machine washable',
        is_active: true,
        is_featured: false,
        store_id: 2,
        category_id: 2,
        sub_category_id: 3
      }
    ], { ignoreDuplicates: true });
    
    console.log('✅ Products created:', products.length);
    
    console.log('🎉 Sample data creation completed successfully!');
    console.log(`📊 Created ${categories.length} categories, ${subCategories.length} subcategories, ${stores.length} stores, and ${products.length} products`);
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the script
createSampleData();
