-- Create banners table
CREATE TABLE IF NOT EXISTS `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) NOT NULL,
  `image_alt_text` varchar(255) DEFAULT NULL,
  `banner_type` varchar(100) NOT NULL,
  `resource_type` varchar(100) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `resource_url` varchar(500) DEFAULT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_url` varchar(500) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `clicks` int(11) DEFAULT 0,
  `impressions` int(11) DEFAULT 0,
  `ctr` decimal(5,2) DEFAULT 0.00,
  `target_audience` varchar(255) DEFAULT NULL,
  `display_conditions` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_banner_type` (`banner_type`),
  KEY `idx_banner_active` (`is_active`),
  KEY `idx_banner_featured` (`is_featured`),
  KEY `idx_banner_sort_order` (`sort_order`),
  KEY `idx_banner_dates` (`start_date`, `end_date`),
  KEY `idx_banner_resource` (`resource_type`, `resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample banners
INSERT INTO `banners` (`title`, `subtitle`, `description`, `image`, `banner_type`, `button_text`, `button_url`, `is_active`, `is_featured`, `sort_order`) VALUES
('Smart Home Smart Savings!', 'Unmissable deals on all your home appliance needs.', 'Get the best deals on premium home appliances including refrigerators, washing machines, and kitchen essentials.', 'uploads/banners/sample-banner-1.jpg', 'main_banner', 'Get Yours', '/products/home-appliances', 1, 1, 1),
('Electronics Sale', 'Up to 50% off on Electronics', 'Amazing discounts on smartphones, laptops, and other electronic devices.', 'uploads/banners/sample-banner-2.jpg', 'category_banner', 'Shop Now', '/products/electronics', 1, 1, 2),
('Kitchen Appliances', 'Transform Your Kitchen', 'Premium quality kitchen appliances for modern homes.', 'uploads/banners/sample-banner-3.jpg', 'product_banner', 'Explore', '/products/kitchen-appliances', 1, 0, 3);
