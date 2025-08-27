const User = require('./User');
const Store = require('./Store');
const Product = require('./Product');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Brand = require('./Brand');
const Attribute = require('./Attribute');
const AttributeValue = require('./AttributeValue');
const ProductVariant = require('./ProductVariant');
const ProductCategory = require('./ProductCategory');
const ProductBrand = require('./ProductBrand');
const ProductAttribute = require('./ProductAttribute');
const ProductMedia = require('./ProductMedia');
const Stock = require('./Stock');
const Media = require('./Media');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Address = require('./Address');
const Shipment = require('./Shipment');
const Payment = require('./Payment');
const RefundRequest = require('./RefundRequest');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');
const Ticket = require('./Ticket');
const Message = require('./Message');
const Banner = require('./Banner');
const Coupon = require('./Coupon');
const Offer = require('./Offer');
const Announcement = require('./Announcement');
const Notification = require('./Notification');
const Page = require('./Page');
const BlogPost = require('./BlogPost');
const Review = require('./Review');
const Like = require('./Like');
const Subscriber = require('./Subscriber');
const Settings = require('./Settings');
const AuditLog = require('./AuditLog');

// User Associations
User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });
User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' });
User.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
User.hasMany(Order, { foreignKey: 'deliveryManId', as: 'deliveries' });
User.hasMany(Wallet, { foreignKey: 'userId', as: 'wallets' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
User.hasMany(RefundRequest, { foreignKey: 'customerId', as: 'refundRequests' });
User.hasMany(Ticket, { foreignKey: 'customerId', as: 'tickets' });
User.hasMany(Ticket, { foreignKey: 'assignedTo', as: 'assignedTickets' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'messages' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Review, { foreignKey: 'customerId', as: 'reviews' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
User.hasMany(BlogPost, { foreignKey: 'authorId', as: 'blogPosts' });
  // User.hasMany(Banner, { foreignKey: 'createdBy', as: 'banners' }); // Commented out as createdBy field doesn't exist in banners table
  User.hasMany(Coupon, { foreignKey: 'createdBy', as: 'coupons' });
  User.hasMany(Offer, { foreignKey: 'createdBy', as: 'offers' });
  User.hasMany(Announcement, { foreignKey: 'createdBy', as: 'announcements' });
  User.hasMany(Page, { foreignKey: 'createdBy', as: 'pages' });
User.hasMany(Page, { foreignKey: 'publishedBy', as: 'publishedPages' });
User.hasMany(Settings, { foreignKey: 'updatedBy', as: 'settingsUpdates' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });

// Store Associations
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
Store.hasMany(Product, { foreignKey: 'store_id', as: 'products' });
Store.hasMany(Order, { foreignKey: 'storeId', as: 'orders' });
Store.hasMany(Stock, { foreignKey: 'storeId', as: 'inventory' });
Store.hasMany(Ticket, { foreignKey: 'storeId', as: 'tickets' });

// Product Associations
Product.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.belongsTo(SubCategory, { foreignKey: 'sub_category_id', as: 'subCategory' });
// Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' }); // Removed - field doesn't exist in DB
Product.hasMany(ProductVariant, { foreignKey: 'productId', as: 'variants' });
Product.hasMany(ProductCategory, { foreignKey: 'productId', as: 'productCategories' });
Product.hasMany(ProductBrand, { foreignKey: 'productId', as: 'productBrands' });
Product.hasMany(ProductAttribute, { foreignKey: 'productId', as: 'productAttributes' });
Product.hasMany(ProductMedia, { foreignKey: 'product_id', as: 'productMedia' });
Product.hasMany(Stock, { foreignKey: 'productId', as: 'stock' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
Product.hasMany(Review, { foreignKey: 'productId', as: 'reviews' });
Product.hasMany(Like, { foreignKey: 'likeableId', constraints: false, scope: { likeableType: 'product' } });

// Category Associations
Category.hasMany(ProductCategory, { foreignKey: 'categoryId', as: 'productCategories' });
Category.belongsToMany(Product, { through: ProductCategory, as: 'products' });
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });

// SubCategory associations
Category.hasMany(SubCategory, { as: 'subCategories', foreignKey: 'categoryId' });
SubCategory.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

// Product associations for Category and SubCategory
Category.hasMany(Product, { foreignKey: 'category_id', as: 'categoryProducts' });
SubCategory.hasMany(Product, { foreignKey: 'sub_category_id', as: 'subCategoryProducts' });

// Brand Associations
Brand.hasMany(ProductBrand, { foreignKey: 'brandId', as: 'productBrands' });
Brand.belongsToMany(Product, { through: ProductBrand, as: 'brandProducts' });

// Attribute Associations
Attribute.hasMany(AttributeValue, { foreignKey: 'attributeId', as: 'values' });
Attribute.hasMany(ProductAttribute, { foreignKey: 'attributeId', as: 'productAttributes' });

// AttributeValue Associations
AttributeValue.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });
AttributeValue.hasMany(ProductAttribute, { foreignKey: 'attributeValueId', as: 'productAttributes' });

// ProductVariant Associations
ProductVariant.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductVariant.hasMany(Stock, { foreignKey: 'variantId', as: 'stock' });
ProductVariant.hasMany(OrderItem, { foreignKey: 'variantId', as: 'orderItems' });

// ProductCategory Associations
ProductCategory.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductCategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// ProductBrand Associations
ProductBrand.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductBrand.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });

// ProductAttribute Associations
ProductAttribute.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductAttribute.belongsTo(Attribute, { foreignKey: 'attributeId', as: 'attribute' });
ProductAttribute.belongsTo(AttributeValue, { foreignKey: 'attributeValueId', as: 'attributeValue' });

// ProductMedia Associations
ProductMedia.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
ProductMedia.belongsTo(Media, { foreignKey: 'mediaId', as: 'media' });

// Stock Associations
Stock.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Stock.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
Stock.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Media Associations
Media.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });
Media.hasMany(ProductMedia, { foreignKey: 'mediaId', as: 'productMedia' });

// Order Associations
Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Order.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Order.belongsTo(User, { foreignKey: 'deliveryManId', as: 'deliveryMan' });
Order.belongsTo(Address, { foreignKey: 'billingAddressId', as: 'billingAddressRef' });
Order.belongsTo(Address, { foreignKey: 'shippingAddressId', as: 'shippingAddressRef' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Order.hasMany(Shipment, { foreignKey: 'orderId', as: 'shipments' });
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Order.hasMany(RefundRequest, { foreignKey: 'orderId', as: 'refundRequests' });
Order.hasMany(Ticket, { foreignKey: 'orderId', as: 'tickets' });

// OrderItem Associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
OrderItem.belongsTo(ProductVariant, { foreignKey: 'variantId', as: 'variant' });
OrderItem.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Address Associations
Address.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Address.hasMany(Order, { foreignKey: 'billingAddressId', as: 'billingOrders' });
Address.hasMany(Order, { foreignKey: 'shippingAddressId', as: 'shippingOrders' });

// Shipment Associations
Shipment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Payment Associations
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// RefundRequest Associations
RefundRequest.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
RefundRequest.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
RefundRequest.belongsTo(OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });

// Wallet Associations
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' });

// Transaction Associations
Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Transaction.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Transaction.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Ticket Associations
Ticket.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Ticket.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
Ticket.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Ticket.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Ticket.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });
Ticket.hasMany(Message, { foreignKey: 'ticketId', as: 'messages' });

// Message Associations
Message.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// Banner Associations - Commented out as createdBy field doesn't exist in banners table
// Banner.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Coupon Associations
Coupon.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Offer Associations
Offer.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Announcement Associations
Announcement.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Notification Associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Page Associations
Page.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Page.belongsTo(User, { foreignKey: 'publishedBy', as: 'publisher' });

// BlogPost Associations
BlogPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
BlogPost.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
BlogPost.hasMany(Like, { foreignKey: 'likeableId', constraints: false, scope: { likeableType: 'blog_post' } });

// Review Associations
Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Review.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Review.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Review.hasMany(Like, { foreignKey: 'likeableId', constraints: false, scope: { likeableType: 'review' } });

// Like Associations
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Settings Associations
Settings.belongsTo(User, { foreignKey: 'updatedBy', as: 'updater' });

// AuditLog Associations
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Store,
  Product,
  Category,
  Brand,
  Attribute,
  AttributeValue,
  ProductVariant,
  ProductCategory,
  ProductBrand,
  ProductAttribute,
  ProductMedia,
  Stock,
  Media,
  Order,
  OrderItem,
  Address,
  Shipment,
  Payment,
  RefundRequest,
  Wallet,
  Transaction,
  Ticket,
  Message,
  Banner,
  Coupon,
  Offer,
  Announcement,
  Notification,
  Page,
  BlogPost,
  Review,
  Like,
  Subscriber,
  Settings,
  AuditLog
};
