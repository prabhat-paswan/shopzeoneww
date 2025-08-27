-- Migration: Create sub_categories table
-- Date: 2024-01-01
-- Description: Creates the sub_categories table for the e-commerce platform

CREATE TABLE IF NOT EXISTS `sub_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT 'Sub category name in English',
  `slug` varchar(255) NOT NULL COMMENT 'URL-friendly sub category name',
  `priority` int(11) DEFAULT 0 COMMENT 'Display priority order',
  `isActive` tinyint(1) DEFAULT 1 COMMENT 'Sub category status (0=Inactive, 1=Active)',
  `categoryId` int(11) NOT NULL COMMENT 'Parent category ID',
  `metaTitle` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `metaDescription` text DEFAULT NULL COMMENT 'SEO meta description',
  `metaKeywords` text DEFAULT NULL COMMENT 'SEO meta keywords',
  `createdBy` int(11) DEFAULT NULL COMMENT 'User ID who created the sub category',
  `updatedBy` int(11) DEFAULT NULL COMMENT 'User ID who last updated the sub category',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sub_categories_slug` (`slug`),
  KEY `idx_sub_categories_category_id` (`categoryId`),
  KEY `idx_sub_categories_is_active` (`isActive`),
  KEY `idx_sub_categories_priority` (`priority`),
  KEY `idx_sub_categories_created_at` (`createdAt`),
  KEY `idx_sub_categories_updated_at` (`updatedAt`),
  CONSTRAINT `fk_sub_categories_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sub_categories_created_by` FOREIGN KEY (`createdBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_sub_categories_updated_by` FOREIGN KEY (`updatedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Product sub categories table';

-- Insert sample sub categories
INSERT INTO `sub_categories` (`name`, `slug`, `priority`, `isActive`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('Smartphones', 'smartphones', 1, 1, 1, NOW(), NOW()),
('Laptops', 'laptops', 2, 1, 1, NOW(), NOW()),
('Tablets', 'tablets', 3, 1, 1, NOW(), NOW()),
('Men\'s Clothing', 'mens-clothing', 1, 1, 2, NOW(), NOW()),
('Women\'s Clothing', 'womens-clothing', 2, 1, 2, NOW(), NOW()),
('Kids\' Clothing', 'kids-clothing', 3, 1, 2, NOW(), NOW()),
('Furniture', 'furniture', 1, 1, 3, NOW(), NOW()),
('Kitchen & Dining', 'kitchen-dining', 2, 1, 3, NOW(), NOW()),
('Garden Tools', 'garden-tools', 3, 1, 3, NOW(), NOW()),
('Car Care & Detailing', 'car-care-detailing', 1, 1, 6, NOW(), NOW()),
('Car Electronics', 'car-electronics', 2, 1, 6, NOW(), NOW()),
('Auto Parts', 'auto-parts', 3, 1, 6, NOW(), NOW()),
('Skincare', 'skincare', 1, 1, 7, NOW(), NOW()),
('Makeup', 'makeup', 2, 1, 7, NOW(), NOW()),
('Hair Care', 'hair-care', 3, 1, 7, NOW(), NOW()),
('Board Games', 'board-games', 1, 1, 8, NOW(), NOW()),
('Video Games', 'video-games', 2, 1, 8, NOW(), NOW()),
('Educational Toys', 'educational-toys', 3, 1, 8, NOW(), NOW());
