'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create demo users
    const users = await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@shopzeo.com',
        password: await bcrypt.hash('Admin@123', 12),
        role: 'admin',
        phone: '+1234567890',
        isActive: true,
        isVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Vendor',
        email: 'vendor@shopzeo.com',
        password: await bcrypt.hash('Vendor@123', 12),
        role: 'vendor',
        phone: '+1234567891',
        isActive: true,
        isVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sarah Customer',
        email: 'customer@shopzeo.com',
        password: await bcrypt.hash('Customer@123', 12),
        role: 'customer',
        phone: '+1234567892',
        isActive: true,
        isVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mike Delivery',
        email: 'delivery@shopzeo.com',
        password: await bcrypt.hash('Delivery@123', 12),
        role: 'delivery_man',
        phone: '+1234567893',
        isActive: true,
        isVerified: true,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create demo stores
    const stores = await queryInterface.bulkInsert('stores', [
      {
        userId: users[1].id, // John Vendor
        name: "John's Electronics Store",
        slug: 'johns-electronics-store',
        description: 'Premium electronics and gadgets',
        logo: 'https://example.com/logo1.jpg',
        banner: 'https://example.com/banner1.jpg',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        postalCode: '94105',
        phone: '+1234567891',
        email: 'john@electronics.com',
        website: 'https://johnselectronics.com',
        status: 'approved',
        rating: 4.5,
        totalSales: 25000.00,
        commissionRate: 10.00,
        businessHours: JSON.stringify({
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: 'closed', close: 'closed' }
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create demo categories
    const categories = await queryInterface.bulkInsert('categories', [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic devices and gadgets',
        image: 'https://example.com/electronics.jpg',
        level: 0,
        sortOrder: 1,
        isActive: true,
        metaTitle: 'Electronics - Shopzeo',
        metaDescription: 'Shop the latest electronics and gadgets',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and accessories',
        image: 'https://example.com/smartphones.jpg',
        parentId: 1, // Electronics
        level: 1,
        sortOrder: 1,
        isActive: true,
        metaTitle: 'Smartphones - Shopzeo',
        metaDescription: 'Latest smartphones and mobile accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Portable computers and accessories',
        image: 'https://example.com/laptops.jpg',
        parentId: 1, // Electronics
        level: 1,
        sortOrder: 2,
        isActive: true,
        metaTitle: 'Laptops - Shopzeo',
        metaDescription: 'High-performance laptops and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://example.com/fashion.jpg',
        level: 0,
        sortOrder: 2,
        isActive: true,
        metaTitle: 'Fashion - Shopzeo',
        metaDescription: 'Latest fashion trends and styles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Men\'s Clothing',
        slug: 'mens-clothing',
        description: 'Men\'s apparel and accessories',
        image: 'https://example.com/mens-clothing.jpg',
        parentId: 4, // Fashion
        level: 1,
        sortOrder: 1,
        isActive: true,
        metaTitle: 'Men\'s Clothing - Shopzeo',
        metaDescription: 'Stylish men\'s clothing and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Women\'s Clothing',
        slug: 'womens-clothing',
        description: 'Women\'s apparel and accessories',
        image: 'https://example.com/womens-clothing.jpg',
        parentId: 4, // Fashion
        level: 1,
        sortOrder: 2,
        isActive: true,
        metaTitle: 'Women\'s Clothing - Shopzeo',
        metaDescription: 'Elegant women\'s clothing and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        image: 'https://example.com/home-garden.jpg',
        level: 0,
        sortOrder: 3,
        isActive: true,
        metaTitle: 'Home & Garden - Shopzeo',
        metaDescription: 'Everything for your home and garden',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        image: 'https://example.com/sports-outdoors.jpg',
        level: 0,
        sortOrder: 4,
        isActive: true,
        metaTitle: 'Sports & Outdoors - Shopzeo',
        metaDescription: 'Quality sports equipment and outdoor gear',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create demo brands
    const brands = await queryInterface.bulkInsert('brands', [
      {
        name: 'Apple',
        slug: 'apple',
        description: 'Think Different',
        logo: 'https://example.com/apple-logo.jpg',
        banner: 'https://example.com/apple-banner.jpg',
        website: 'https://apple.com',
        isActive: true,
        sortOrder: 1,
        metaTitle: 'Apple - Shopzeo',
        metaDescription: 'Official Apple products and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Samsung',
        slug: 'samsung',
        description: 'Do What You Can\'t',
        logo: 'https://example.com/samsung-logo.jpg',
        banner: 'https://example.com/samsung-banner.jpg',
        website: 'https://samsung.com',
        isActive: true,
        sortOrder: 2,
        metaTitle: 'Samsung - Shopzeo',
        metaDescription: 'Official Samsung products and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Nike',
        slug: 'nike',
        description: 'Just Do It',
        logo: 'https://example.com/nike-logo.jpg',
        banner: 'https://example.com/nike-banner.jpg',
        website: 'https://nike.com',
        isActive: true,
        sortOrder: 3,
        metaTitle: 'Nike - Shopzeo',
        metaDescription: 'Official Nike products and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Impossible Is Nothing',
        logo: 'https://example.com/adidas-logo.jpg',
        banner: 'https://example.com/adidas-banner.jpg',
        website: 'https://adidas.com',
        isActive: true,
        sortOrder: 4,
        metaTitle: 'Adidas - Shopzeo',
        metaDescription: 'Official Adidas products and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dell',
        slug: 'dell',
        description: 'The Power To Do More',
        logo: 'https://example.com/dell-logo.jpg',
        banner: 'https://example.com/dell-banner.jpg',
        website: 'https://dell.com',
        isActive: true,
        sortOrder: 5,
        metaTitle: 'Dell - Shopzeo',
        metaDescription: 'Official Dell products and accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create demo products
    const products = await queryInterface.bulkInsert('products', [
      {
        storeId: stores[0].id,
        createdBy: users[1].id, // John Vendor
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        sku: 'IPH15PRO-001',
        description: 'The most advanced iPhone ever with A17 Pro chip',
        shortDescription: 'Latest iPhone with pro camera system',
        price: 999.00,
        comparePrice: 1099.00,
        costPrice: 800.00,
        weight: 0.187,
        dimensions: JSON.stringify({ length: 14.7, width: 7.1, height: 0.8 }),
        isActive: true,
        isApproved: true,
        isFeatured: true,
        isInStock: true,
        stockQuantity: 50,
        lowStockThreshold: 5,
        rating: 4.8,
        reviewCount: 25,
        viewCount: 150,
        soldCount: 10,
        metaTitle: 'iPhone 15 Pro - Shopzeo',
        metaDescription: 'Get the latest iPhone 15 Pro with advanced features',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        storeId: stores[0].id,
        createdBy: users[1].id,
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        sku: 'SGS24-001',
        description: 'Next-generation Android smartphone with AI features',
        shortDescription: 'AI-powered Samsung flagship phone',
        price: 899.00,
        comparePrice: 999.00,
        costPrice: 720.00,
        weight: 0.168,
        dimensions: JSON.stringify({ length: 14.7, width: 7.0, height: 0.7 }),
        isActive: true,
        isApproved: true,
        isFeatured: true,
        isInStock: true,
        stockQuantity: 40,
        lowStockThreshold: 5,
        rating: 4.7,
        reviewCount: 20,
        viewCount: 120,
        soldCount: 8,
        metaTitle: 'Samsung Galaxy S24 - Shopzeo',
        metaDescription: 'Experience AI-powered Samsung Galaxy S24',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        storeId: stores[0].id,
        createdBy: users[1].id,
        name: 'MacBook Pro 16"',
        slug: 'macbook-pro-16',
        sku: 'MBP16-001',
        description: 'Professional laptop with M3 Pro chip',
        shortDescription: 'Powerful MacBook Pro for professionals',
        price: 2499.00,
        comparePrice: 2699.00,
        costPrice: 2000.00,
        weight: 2.1,
        dimensions: JSON.stringify({ length: 35.6, width: 24.8, height: 1.6 }),
        isActive: true,
        isApproved: true,
        isFeatured: true,
        isInStock: true,
        stockQuantity: 20,
        lowStockThreshold: 3,
        rating: 4.9,
        reviewCount: 15,
        viewCount: 80,
        soldCount: 5,
        metaTitle: 'MacBook Pro 16" - Shopzeo',
        metaDescription: 'Professional MacBook Pro with M3 Pro chip',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        storeId: stores[0].id,
        createdBy: users[1].id,
        name: 'Nike Air Max 270',
        slug: 'nike-air-max-270',
        sku: 'NAM270-001',
        description: 'Comfortable running shoes with Air Max technology',
        shortDescription: 'Premium Nike running shoes',
        price: 150.00,
        comparePrice: 180.00,
        costPrice: 90.00,
        weight: 0.8,
        dimensions: JSON.stringify({ length: 30, width: 12, height: 8 }),
        isActive: true,
        isApproved: true,
        isFeatured: false,
        isInStock: true,
        stockQuantity: 100,
        lowStockThreshold: 10,
        rating: 4.6,
        reviewCount: 30,
        viewCount: 200,
        soldCount: 25,
        metaTitle: 'Nike Air Max 270 - Shopzeo',
        metaDescription: 'Comfortable Nike running shoes with Air Max',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        storeId: stores[0].id,
        createdBy: users[1].id,
        name: 'Adidas Ultraboost 22',
        slug: 'adidas-ultraboost-22',
        sku: 'AUB22-001',
        description: 'Responsive running shoes with Boost technology',
        shortDescription: 'High-performance Adidas running shoes',
        price: 180.00,
        comparePrice: 200.00,
        costPrice: 108.00,
        weight: 0.7,
        dimensions: JSON.stringify({ length: 29, width: 11, height: 7 }),
        isActive: true,
        isApproved: true,
        isFeatured: false,
        isInStock: true,
        stockQuantity: 80,
        lowStockThreshold: 8,
        rating: 4.5,
        reviewCount: 22,
        viewCount: 150,
        soldCount: 18,
        metaTitle: 'Adidas Ultraboost 22 - Shopzeo',
        metaDescription: 'Responsive Adidas running shoes with Boost',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create product-category associations
    await queryInterface.bulkInsert('product_categories', [
      { productId: 1, categoryId: 1, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 1, categoryId: 2, isPrimary: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, categoryId: 1, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, categoryId: 2, isPrimary: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, categoryId: 1, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, categoryId: 3, isPrimary: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, categoryId: 4, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, categoryId: 5, isPrimary: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, categoryId: 4, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, categoryId: 5, isPrimary: false, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Create product-brand associations
    await queryInterface.bulkInsert('product_brands', [
      { productId: 1, brandId: 1, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, brandId: 2, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, brandId: 1, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, brandId: 3, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, brandId: 4, isPrimary: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Create demo addresses
    const addresses = await queryInterface.bulkInsert('addresses', [
      {
        userId: users[2].id, // Sarah Customer
        type: 'both',
        isDefault: true,
        firstName: 'Sarah',
        lastName: 'Customer',
        company: 'Home Office',
        addressLine1: '456 Customer Street',
        addressLine2: 'Apt 2B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States',
        phone: '+1234567892',
        email: 'sarah@example.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[1].id, // John Vendor
        type: 'both',
        isDefault: true,
        firstName: 'John',
        lastName: 'Vendor',
        company: 'John\'s Electronics',
        addressLine1: '789 Vendor Avenue',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States',
        phone: '+1234567891',
        email: 'john@electronics.com',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    // Create demo wallets
    await queryInterface.bulkInsert('wallets', [
      {
        userId: users[0].id, // Admin
        type: 'admin',
        balance: 10000.00,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[1].id, // Vendor
        type: 'vendor',
        balance: 5000.00,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[2].id, // Customer
        type: 'customer',
        balance: 1000.00,
        currency: 'USD',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo orders
    const orders = await queryInterface.bulkInsert('orders', [
      {
        orderNumber: 'ORD-20241201-001',
        customerId: users[2].id, // Sarah Customer
        storeId: stores[0].id,
        billingAddressId: addresses[0].id,
        shippingAddressId: addresses[0].id,
        paymentMethod: 'stripe',
        subtotal: 999.00,
        taxAmount: 79.92,
        shippingAmount: 15.00,
        discountAmount: 0.00,
        totalAmount: 1093.92,
        status: 'confirmed',
        paymentStatus: 'paid',
        paidAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderNumber: 'ORD-20241201-002',
        customerId: users[2].id, // Sarah Customer
        storeId: stores[0].id,
        billingAddressId: addresses[0].id,
        shippingAddressId: addresses[0].id,
        paymentMethod: 'paypal',
        subtotal: 330.00,
        taxAmount: 26.40,
        shippingAmount: 20.00,
        discountAmount: 30.00,
        totalAmount: 346.40,
        status: 'delivered',
        paymentStatus: 'paid',
        paidAt: new Date(Date.now() - 86400000), // 1 day ago
        actualDelivery: new Date(Date.now() - 43200000), // 12 hours ago
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 43200000)
      }
    ], { returning: true });

    // Create demo order items
    await queryInterface.bulkInsert('order_items', [
      {
        orderId: orders[0].id,
        productId: 1, // iPhone 15 Pro
        storeId: stores[0].id,
        productName: 'iPhone 15 Pro',
        productSku: 'IPH15PRO-001',
        quantity: 1,
        unitPrice: 999.00,
        totalPrice: 999.00,
        discountAmount: 0.00,
        taxAmount: 79.92,
        finalPrice: 1078.92,
        weight: 0.187,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderId: orders[1].id,
        productId: 4, // Nike Air Max 270
        storeId: stores[0].id,
        productName: 'Nike Air Max 270',
        productSku: 'NAM270-001',
        quantity: 1,
        unitPrice: 150.00,
        totalPrice: 150.00,
        discountAmount: 15.00,
        taxAmount: 10.80,
        finalPrice: 145.80,
        weight: 0.8,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      },
      {
        orderId: orders[1].id,
        productId: 5, // Adidas Ultraboost 22
        storeId: stores[0].id,
        productName: 'Adidas Ultraboost 22',
        productSku: 'AUB22-001',
        quantity: 1,
        unitPrice: 180.00,
        totalPrice: 180.00,
        discountAmount: 15.00,
        taxAmount: 15.60,
        finalPrice: 180.60,
        weight: 0.7,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000)
      }
    ]);

    // Create demo reviews
    await queryInterface.bulkInsert('reviews', [
      {
        productId: 1, // iPhone 15 Pro
        customerId: users[2].id, // Sarah Customer
        orderId: orders[0].id,
        rating: 5,
        title: 'Amazing phone!',
        comment: 'The iPhone 15 Pro is absolutely incredible. The camera quality is outstanding and the performance is lightning fast.',
        isVerified: true,
        isApproved: true,
        helpfulCount: 3,
        reviewedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 4, // Nike Air Max 270
        customerId: users[2].id, // Sarah Customer
        orderId: orders[1].id,
        rating: 4,
        title: 'Great running shoes',
        comment: 'Very comfortable for long runs. The Air Max technology really makes a difference.',
        isVerified: true,
        isApproved: true,
        helpfulCount: 1,
        reviewedAt: new Date(Date.now() - 43200000),
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43200000)
      }
    ]);

    // Create demo banners
    await queryInterface.bulkInsert('banners', [
      {
        title: 'Holiday Sale',
        subtitle: 'Up to 50% Off',
        description: 'Get amazing deals on electronics and fashion',
        image: 'https://example.com/holiday-sale.jpg',
        mobileImage: 'https://example.com/holiday-sale-mobile.jpg',
        link: '/sale',
        linkType: 'internal',
        position: 'hero',
        sortOrder: 1,
        isActive: true,
        isMobile: true,
        isDesktop: true,
        clicks: 0,
        impressions: 0,
        createdBy: users[0].id, // Admin
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'New Arrivals',
        subtitle: 'Latest Products',
        description: 'Check out our newest arrivals',
        image: 'https://example.com/new-arrivals.jpg',
        mobileImage: 'https://example.com/new-arrivals-mobile.jpg',
        link: '/new-arrivals',
        linkType: 'internal',
        position: 'middle',
        sortOrder: 2,
        isActive: true,
        isMobile: true,
        isDesktop: true,
        clicks: 0,
        impressions: 0,
        createdBy: users[0].id, // Admin
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo coupons
    await queryInterface.bulkInsert('coupons', [
      {
        code: 'WELCOME10',
        name: 'Welcome Discount',
        description: 'Get 10% off on your first order',
        type: 'percentage',
        value: 10.00,
        maxDiscount: 50.00,
        minOrderAmount: 100.00,
        maxUses: 1000,
        usedCount: 0,
        maxUsesPerUser: 1,
        isActive: true,
        isFirstTimeOnly: true,
        isNewCustomerOnly: true,
        createdBy: users[0].id, // Admin
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'SAVE20',
        name: 'Save 20%',
        description: 'Get 20% off on electronics',
        type: 'percentage',
        value: 20.00,
        maxDiscount: 200.00,
        minOrderAmount: 200.00,
        maxUses: 500,
        usedCount: 0,
        maxUsesPerUser: 2,
        isActive: true,
        isFirstTimeOnly: false,
        isNewCustomerOnly: false,
        applicableCategories: JSON.stringify([1]), // Electronics
        createdBy: users[0].id, // Admin
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo announcements
    await queryInterface.bulkInsert('announcements', [
      {
        title: 'New Features Available',
        content: 'We\'ve added new features to improve your shopping experience!',
        type: 'info',
        priority: 'normal',
        isActive: true,
        isSticky: false,
        isDismissible: true,
        displayLocation: 'header',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        icon: 'info',
        sortOrder: 1,
        createdBy: users[0].id, // Admin
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Maintenance Notice',
        content: 'Scheduled maintenance on December 15th from 2-4 AM EST',
        type: 'warning',
        priority: 'high',
        isActive: true,
        isSticky: true,
        isDismissible: false,
        displayLocation: 'header',
        backgroundColor: '#F59E0B',
        textColor: '#FFFFFF',
        icon: 'warning',
        sortOrder: 2,
        createdBy: users[0].id, // Admin
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo pages
    await queryInterface.bulkInsert('pages', [
      {
        title: 'About Us',
        slug: 'about-us',
        content: '<h1>About Shopzeo</h1><p>We are a leading multivendor eCommerce platform...</p>',
        excerpt: 'Learn more about Shopzeo and our mission',
        pageType: 'about',
        status: 'published',
        isActive: true,
        isPublic: true,
        requiresAuth: false,
        featuredImage: 'https://example.com/about-us.jpg',
        metaTitle: 'About Us - Shopzeo',
        metaDescription: 'Learn more about Shopzeo and our mission',
        sortOrder: 1,
        publishedAt: new Date(),
        createdBy: users[0].id, // Admin
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Contact Us',
        slug: 'contact-us',
        content: '<h1>Contact Shopzeo</h1><p>Get in touch with our team...</p>',
        excerpt: 'Contact our support team',
        pageType: 'contact',
        status: 'published',
        isActive: true,
        isPublic: true,
        requiresAuth: false,
        featuredImage: 'https://example.com/contact-us.jpg',
        metaTitle: 'Contact Us - Shopzeo',
        metaDescription: 'Get in touch with our support team',
        sortOrder: 2,
        publishedAt: new Date(),
        createdBy: users[0].id, // Admin
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo blog posts
    await queryInterface.bulkInsert('blog_posts', [
      {
        title: 'Top 10 Tech Trends for 2024',
        slug: 'top-10-tech-trends-2024',
        excerpt: 'Discover the latest technology trends that will shape 2024',
        content: '<h1>Top 10 Tech Trends for 2024</h1><p>Artificial Intelligence continues to dominate...</p>',
        featuredImage: 'https://example.com/tech-trends.jpg',
        authorId: users[0].id, // Admin
        categoryId: 1, // Electronics
        tags: JSON.stringify(['technology', 'trends', '2024', 'AI']),
        status: 'published',
        isActive: true,
        isFeatured: true,
        isPublic: true,
        requiresAuth: false,
        metaTitle: 'Top 10 Tech Trends for 2024 - Shopzeo',
        metaDescription: 'Discover the latest technology trends that will shape 2024',
        publishedAt: new Date(),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        readingTime: 5,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo subscribers
    await queryInterface.bulkInsert('subscribers', [
      {
        email: 'customer@shopzeo.com',
        firstName: 'Sarah',
        lastName: 'Customer',
        isActive: true,
        isVerified: true,
        verifiedAt: new Date(),
        source: 'website',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Create demo settings
    await queryInterface.bulkInsert('settings', [
      {
        key: 'store_name',
        value: 'Shopzeo',
        type: 'string',
        category: 'business',
        group: 'general',
        label: 'Store Name',
        description: 'The name of your eCommerce store',
        isRequired: true,
        isPublic: true,
        isEditable: true,
        defaultValue: 'Shopzeo',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'store_description',
        value: 'Your Multivendor Marketplace',
        type: 'string',
        category: 'business',
        group: 'general',
        label: 'Store Description',
        description: 'A brief description of your store',
        isRequired: false,
        isPublic: true,
        isEditable: true,
        defaultValue: 'Your Multivendor Marketplace',
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'currency',
        value: 'USD',
        type: 'select',
        category: 'business',
        group: 'general',
        label: 'Currency',
        description: 'Default currency for the store',
        isRequired: true,
        isPublic: true,
        isEditable: true,
        options: JSON.stringify(['USD', 'EUR', 'GBP', 'INR']),
        defaultValue: 'USD',
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: 'tax_rate',
        value: '8.0',
        type: 'number',
        category: 'tax',
        group: 'pricing',
        label: 'Default Tax Rate',
        description: 'Default tax rate in percentage',
        isRequired: true,
        isPublic: false,
        isEditable: true,
        defaultValue: '8.0',
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Demo data seeded successfully!');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all seeded data in reverse order
    await queryInterface.bulkDelete('settings', null, {});
    await queryInterface.bulkDelete('subscribers', null, {});
    await queryInterface.bulkDelete('blog_posts', null, {});
    await queryInterface.bulkDelete('pages', null, {});
    await queryInterface.bulkDelete('announcements', null, {});
    await queryInterface.bulkDelete('coupons', null, {});
    await queryInterface.bulkDelete('banners', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
    await queryInterface.bulkDelete('wallets', null, {});
    await queryInterface.bulkDelete('addresses', null, {});
    await queryInterface.bulkDelete('product_brands', null, {});
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('brands', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('stores', null, {});
    await queryInterface.bulkDelete('users', null, {});
    
    console.log('Demo data removed successfully!');
  }
};
