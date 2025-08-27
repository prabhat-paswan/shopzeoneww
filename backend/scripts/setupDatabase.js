const { sequelize } = require('../config/database');
const User = require('../models/User');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully.');
    
    // Create default admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@shopzeo.com',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      emailVerified: true,
      phoneVerified: true
    });
    
    console.log('✅ Default admin user created:', adminUser.email);
    
    // Create sample vendor
    const vendorUser = await User.create({
      firstName: 'John',
      lastName: 'Vendor',
      email: 'vendor@shopzeo.com',
      password: 'vendor123',
      role: 'vendor',
      status: 'active',
      emailVerified: true,
      phoneVerified: true
    });
    
    console.log('✅ Sample vendor user created:', vendorUser.email);
    
    // Create sample store
    const store = await Store.create({
      name: 'Sample Electronics Store',
      slug: 'sample-electronics-store',
      description: 'A sample electronics store for demonstration',
      userId: vendorUser.id,
      status: 'active',
      verified: true,
      featured: true,
      rating: 4.5,
      totalRatings: 10,
      totalSales: 15000.00,
      totalOrders: 45
    });
    
    console.log('✅ Sample store created:', store.name);
    
    // Create sample customer
    const customerUser = await User.create({
      firstName: 'Jane',
      lastName: 'Customer',
      email: 'customer@shopzeo.com',
      password: 'customer123',
      role: 'customer',
      status: 'active',
      emailVerified: true,
      phoneVerified: true
    });
    
    console.log('✅ Sample customer user created:', customerUser.email);
    
    // Create sample delivery man
    const deliveryUser = await User.create({
      firstName: 'Mike',
      lastName: 'Delivery',
      email: 'delivery@shopzeo.com',
      password: 'delivery123',
      role: 'delivery_man',
      status: 'active',
      emailVerified: true,
      phoneVerified: true
    });
    
    console.log('✅ Sample delivery man created:', deliveryUser.email);
    
    // Create sample products
    const products = await Product.bulkCreate([
      {
        name: 'iPhone 14 Pro Max',
        slug: 'iphone-14-pro-max',
        description: 'Latest iPhone with advanced features',
        shortDescription: 'Premium smartphone with cutting-edge technology',
        sku: 'IPHONE-14-PRO-MAX-001',
        brand: 'Apple',
        categoryId: '1', // You'll need to create categories
        storeId: store.id,
        type: 'simple',
        status: 'active',
        featured: true,
        price: 999.99,
        stockQuantity: 50,
        rating: 4.8,
        totalRatings: 25,
        totalSales: 9,
        totalViews: 150
      },
      {
        name: 'Samsung Galaxy S23 Ultra',
        slug: 'samsung-galaxy-s23-ultra',
        description: 'Premium Android smartphone with S Pen',
        shortDescription: 'High-end Android device with S Pen functionality',
        sku: 'SAMSUNG-S23-ULTRA-001',
        brand: 'Samsung',
        categoryId: '1',
        storeId: store.id,
        type: 'simple',
        status: 'active',
        featured: true,
        price: 1199.99,
        stockQuantity: 30,
        rating: 4.7,
        totalRatings: 18,
        totalSales: 6,
        totalViews: 120
      },
      {
        name: 'MacBook Pro 16"',
        slug: 'macbook-pro-16',
        description: 'Professional laptop for power users',
        shortDescription: 'High-performance laptop for professionals',
        sku: 'MACBOOK-PRO-16-001',
        brand: 'Apple',
        categoryId: '2', // Laptops category
        storeId: store.id,
        type: 'simple',
        status: 'active',
        featured: true,
        price: 2499.99,
        stockQuantity: 20,
        rating: 4.9,
        totalRatings: 12,
        totalSales: 4,
        totalViews: 80
      }
    ]);
    
    console.log('✅ Sample products created:', products.length);
    
    // Create wallets for users
    const wallets = await Wallet.bulkCreate([
      {
        userId: adminUser.id,
        userType: 'admin',
        type: 'main',
        balance: 0.00
      },
      {
        userId: vendorUser.id,
        userType: 'vendor',
        type: 'main',
        balance: 15000.00
      },
      {
        userId: customerUser.id,
        userType: 'customer',
        type: 'main',
        balance: 500.00
      },
      {
        userId: deliveryUser.id,
        userType: 'delivery_man',
        type: 'main',
        balance: 200.00
      }
    ]);
    
    console.log('✅ User wallets created:', wallets.length);
    
    // Create sample orders
    const orders = await Order.bulkCreate([
      {
        orderNumber: 'ORD-001',
        customerId: customerUser.id,
        storeId: store.id,
        deliveryManId: deliveryUser.id,
        status: 'delivered',
        orderType: 'vendor',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        subtotal: 999.99,
        taxAmount: 89.99,
        shippingAmount: 15.00,
        discountAmount: 50.00,
        totalAmount: 1054.98,
        commissionAmount: 105.50,
        vendorAmount: 949.48,
        currency: 'USD',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        billingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        orderNumber: 'ORD-002',
        customerId: customerUser.id,
        storeId: store.id,
        deliveryManId: deliveryUser.id,
        status: 'out_for_delivery',
        orderType: 'vendor',
        paymentStatus: 'paid',
        paymentMethod: 'paypal',
        subtotal: 1199.99,
        taxAmount: 108.00,
        shippingAmount: 15.00,
        discountAmount: 0.00,
        totalAmount: 1322.99,
        commissionAmount: 132.30,
        vendorAmount: 1190.69,
        currency: 'USD',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        billingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      }
    ]);
    
    console.log('✅ Sample orders created:', orders.length);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('👑 Admin: admin@shopzeo.com / admin123');
    console.log('🏪 Vendor: vendor@shopzeo.com / vendor123');
    console.log('🛒 Customer: customer@shopzeo.com / customer123');
    console.log('🚚 Delivery: delivery@shopzeo.com / delivery123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
