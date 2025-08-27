-- Migration: Create categories table
-- Date: 2024-01-01
-- Description: Creates the categories table for the e-commerce platform

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'Category name in English',
  `nameAr` varchar(255) DEFAULT NULL COMMENT 'Category name in Arabic',
  `nameBn` varchar(255) DEFAULT NULL COMMENT 'Category name in Bangla',
  `nameHi` varchar(255) DEFAULT NULL COMMENT 'Category name in Hindi',
  `slug` varchar(255) NOT NULL COMMENT 'URL-friendly category name',
  `logo` varchar(500) DEFAULT NULL COMMENT 'Category logo image path',
  `banner` varchar(500) DEFAULT NULL COMMENT 'Category banner image path',
  `priority` int(11) DEFAULT 0 COMMENT 'Display priority order',
  `isHomeCategory` tinyint(1) DEFAULT 0 COMMENT 'Show on home page (0=No, 1=Yes)',
  `isActive` tinyint(1) DEFAULT 1 COMMENT 'Category status (0=Inactive, 1=Active)',
  `parentId` int(11) DEFAULT NULL COMMENT 'Parent category ID for subcategories',
  `level` int(11) DEFAULT 1 COMMENT 'Category level (1=main, 2=sub, 3=sub-sub)',
  `metaTitle` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `metaDescription` text DEFAULT NULL COMMENT 'SEO meta description',
  `metaKeywords` text DEFAULT NULL COMMENT 'SEO meta keywords',
  `createdBy` int(11) DEFAULT NULL COMMENT 'User ID who created the category',
  `updatedBy` int(11) DEFAULT NULL COMMENT 'User ID who last updated the category',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`),
  KEY `idx_categories_parent_id` (`parentId`),
  KEY `idx_categories_level` (`level`),
  KEY `idx_categories_is_active` (`isActive`),
  KEY `idx_categories_priority` (`priority`),
  KEY `idx_categories_created_at` (`createdAt`),
  KEY `idx_categories_updated_at` (`updatedAt`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_categories_created_by` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_categories_updated_by` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Product categories table';

-- Insert sample categories
INSERT INTO `categories` (`name`, `slug`, `priority`, `isHomeCategory`, `isActive`, `level`, `createdAt`, `updatedAt`) VALUES
('Electronics', 'electronics', 1, 1, 1, 1, NOW(), NOW()),
('Clothing', 'clothing', 2, 1, 1, 1, NOW(), NOW()),
('Home & Garden', 'home-garden', 3, 1, 1, 1, NOW(), NOW()),
('Sports & Outdoors', 'sports-outdoors', 4, 1, 1, 1, NOW(), NOW()),
('Books & Media', 'books-media', 5, 0, 1, 1, NOW(), NOW()),
('Automotive', 'automotive', 6, 0, 1, 1, NOW(), NOW()),
('Health & Beauty', 'health-beauty', 7, 1, 1, 1, NOW(), NOW()),
('Toys & Games', 'toys-games', 8, 0, 1, 1, NOW(), NOW());

-- Insert subcategories
INSERT INTO `categories` (`name`, `slug`, `priority`, `isHomeCategory`, `isActive`, `parentId`, `level`, `createdAt`, `updatedAt`) VALUES
('Smartphones', 'smartphones', 1, 1, 1, 1, 2, NOW(), NOW()),
('Laptops', 'laptops', 2, 1, 1, 1, 2, NOW(), NOW()),
('Tablets', 'tablets', 3, 0, 1, 1, 2, NOW(), NOW()),
('Men\'s Clothing', 'mens-clothing', 1, 1, 1, 2, 2, NOW(), NOW()),
('Women\'s Clothing', 'womens-clothing', 2, 1, 1, 2, 2, NOW(), NOW()),
('Kids\' Clothing', 'kids-clothing', 3, 0, 1, 2, 2, NOW(), NOW()),
('Furniture', 'furniture', 1, 1, 1, 3, 2, NOW(), NOW()),
('Kitchen & Dining', 'kitchen-dining', 2, 0, 1, 3, 2, NOW(), NOW()),
('Garden Tools', 'garden-tools', 3, 0, 1, 3, 2, NOW(), NOW());

-- Insert sub-subcategories
INSERT INTO `categories` (`name`, `slug`, `priority`, `isHomeCategory`, `isActive`, `parentId`, `level`, `createdAt`, `updatedAt`) VALUES
('Android Phones', 'android-phones', 1, 1, 1, 9, 3, NOW(), NOW()),
('iPhone', 'iphone', 2, 1, 1, 9, 3, NOW(), NOW()),
('Gaming Laptops', 'gaming-laptops', 1, 0, 1, 10, 3, NOW(), NOW()),
('Business Laptops', 'business-laptops', 2, 1, 1, 10, 3, NOW(), NOW()),
('T-Shirts', 't-shirts', 1, 1, 1, 12, 3, NOW(), NOW()),
('Jeans', 'jeans', 2, 1, 1, 12, 3, NOW(), NOW()),
('Dresses', 'dresses', 1, 1, 1, 13, 3, NOW(), NOW()),
('Shoes', 'shoes', 2, 1, 1, 13, 3, NOW(), NOW());
