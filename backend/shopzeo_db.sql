-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2025 at 06:26 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopzeo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('super_admin','admin') DEFAULT 'admin',
  `isActive` tinyint(1) DEFAULT 1,
  `lastLogin` datetime DEFAULT NULL,
  `loginAttempts` int(11) DEFAULT 0,
  `lockedUntil` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `email`, `password`, `name`, `role`, `isActive`, `lastLogin`, `loginAttempts`, `lockedUntil`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@shopzeo.com', '$2a$12$DiR0zbkk.R2W8ht6hmmdi.KgJhIT1F3y12gnT.GkR6.SkosFsSxAO', 'Super Admin', 'super_admin', 1, NULL, 0, NULL, '2025-08-24 01:03:30', '2025-08-24 01:03:30');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL COMMENT 'Banner title',
  `subtitle` varchar(255) DEFAULT NULL COMMENT 'Banner subtitle',
  `description` text DEFAULT NULL COMMENT 'Banner description',
  `image` varchar(500) NOT NULL COMMENT 'Banner image path',
  `image_alt_text` varchar(255) DEFAULT NULL COMMENT 'Alt text for banner image',
  `banner_type` enum('main_banner','footer_banner','popup_banner','sidebar_banner','category_banner','product_banner') NOT NULL DEFAULT 'main_banner' COMMENT 'Type of banner placement',
  `resource_type` enum('custom','product','category','store','page') NOT NULL DEFAULT 'custom' COMMENT 'Type of resource this banner links to',
  `resource_id` int(11) DEFAULT NULL COMMENT 'ID of the linked resource (product, category, etc.)',
  `resource_url` varchar(500) DEFAULT NULL COMMENT 'Custom URL for banner link',
  `button_text` varchar(100) DEFAULT NULL COMMENT 'Text for call-to-action button',
  `button_url` varchar(500) DEFAULT NULL COMMENT 'URL for call-to-action button',
  `start_date` datetime DEFAULT NULL COMMENT 'Banner start date',
  `end_date` datetime DEFAULT NULL COMMENT 'Banner end date',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Banner status',
  `is_featured` tinyint(1) DEFAULT 0 COMMENT 'Whether banner is featured',
  `sort_order` int(11) DEFAULT 0 COMMENT 'Sort order for display',
  `clicks` int(11) DEFAULT 0 COMMENT 'Number of banner clicks',
  `impressions` int(11) DEFAULT 0 COMMENT 'Number of banner impressions',
  `ctr` decimal(5,2) DEFAULT 0.00 COMMENT 'Click-through rate percentage',
  `target_audience` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Target audience criteria (age, location, etc.)' CHECK (json_valid(`target_audience`)),
  `display_conditions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Conditions for banner display' CHECK (json_valid(`display_conditions`)),
  `meta_title` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` text DEFAULT NULL COMMENT 'SEO meta description',
  `meta_keywords` text DEFAULT NULL COMMENT 'SEO meta keywords',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `subtitle`, `description`, `image`, `image_alt_text`, `banner_type`, `resource_type`, `resource_id`, `resource_url`, `button_text`, `button_url`, `start_date`, `end_date`, `is_active`, `is_featured`, `sort_order`, `clicks`, `impressions`, `ctr`, `target_audience`, `display_conditions`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`) VALUES
(1, 'Smart Home Smart Savings!', 'Unmissable deals on all your home appliance needs.', 'Get the best deals on premium home appliances including refrigerators, washing machines, and kitchen essentials.', 'http://localhost:5000/uploads/banners/banner-1755809762268-699131231.jpeg', NULL, 'main_banner', '', NULL, NULL, 'Get Yours', '/products/home-appliances', NULL, NULL, 1, 1, 1, 0, 0, 0.00, NULL, NULL, NULL, NULL, NULL, '2025-08-21 01:59:38', '2025-08-24 14:16:40'),
(2, 'Electronics Sale', 'Up to 50% off on Electronics', 'Amazing discounts on smartphones, laptops, and other electronic devices.', 'http://localhost:5000/uploads/banners/banner-1755809886301-157616563.jpeg', NULL, 'category_banner', '', NULL, NULL, 'Shop Now', '/products/electronics', NULL, NULL, 1, 1, 2, 0, 0, 0.00, NULL, NULL, NULL, NULL, NULL, '2025-08-21 01:59:38', '2025-08-24 14:16:40'),
(3, 'Kitchen Appliances', 'Transform Your Kitchen', 'Premium quality kitchen appliances for modern homes.', 'http://localhost:5000/uploads/banners/banner-1755809932151-228409246.jpeg', NULL, 'product_banner', '', NULL, NULL, 'Explore', '/products/kitchen-appliances', NULL, NULL, 1, 0, 3, 0, 0, 0.00, NULL, NULL, NULL, NULL, NULL, '2025-08-21 01:59:38', '2025-08-24 14:16:40');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Brand name in English',
  `slug` varchar(255) NOT NULL COMMENT 'URL-friendly brand identifier',
  `description` text DEFAULT NULL COMMENT 'Brand description in English',
  `logo` varchar(500) DEFAULT NULL COMMENT 'Brand logo image path',
  `banner` varchar(500) DEFAULT NULL COMMENT 'Brand banner image path',
  `website` varchar(255) DEFAULT NULL COMMENT 'Brand official website',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Brand status',
  `sort_order` int(11) DEFAULT 0 COMMENT 'Sort order for display',
  `meta_title` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` text DEFAULT NULL COMMENT 'SEO meta description',
  `meta_keywords` text DEFAULT NULL COMMENT 'SEO meta keywords',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name_ar` varchar(255) DEFAULT NULL COMMENT 'Brand name in Arabic',
  `name_bn` varchar(255) DEFAULT NULL COMMENT 'Brand name in Bangla',
  `name_hi` varchar(255) DEFAULT NULL COMMENT 'Brand name in Hindi',
  `description_ar` text DEFAULT NULL COMMENT 'Brand description in Arabic',
  `description_bn` text DEFAULT NULL COMMENT 'Brand description in Bangla',
  `description_hi` text DEFAULT NULL COMMENT 'Brand description in Hindi',
  `image_alt_text` varchar(255) DEFAULT NULL COMMENT 'Alt text for brand images',
  `email` varchar(255) DEFAULT NULL COMMENT 'Brand contact email',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Brand contact phone',
  `address` text DEFAULT NULL COMMENT 'Brand address',
  `country` varchar(100) DEFAULT NULL COMMENT 'Brand country of origin',
  `founded_year` int(11) DEFAULT NULL COMMENT 'Year brand was founded',
  `is_featured` tinyint(1) DEFAULT 0 COMMENT 'Whether brand is featured',
  `total_products` int(11) DEFAULT 0 COMMENT 'Total products under this brand',
  `total_sales` decimal(15,2) DEFAULT 0.00 COMMENT 'Total sales for this brand'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `description`, `logo`, `banner`, `website`, `is_active`, `sort_order`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`, `name_ar`, `name_bn`, `name_hi`, `description_ar`, `description_bn`, `description_hi`, `image_alt_text`, `email`, `phone`, `address`, `country`, `founded_year`, `is_featured`, `total_products`, `total_sales`) VALUES
(1, 'Samsung', 'samsung', 'Leading electronics and home appliance brand', 'http://localhost:5000/uploads/brands/brand-1755882682399-606248210.jpeg', 'http://localhost:5000/uploads/brands/samsung-banner.jpg', 'https://samsung.com', 1, 1, 'Samsung Electronics', 'Leading electronics and home appliance brand', 'samsung, electronics, appliances', '0000-00-00 00:00:00', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.00),
(2, 'LG', 'lg', 'Innovative home appliances and electronics', 'http://localhost:5000/uploads/brands/brand-1755883618471-749353359.jpg', 'http://localhost:5000/uploads/brands/lg-banner.jpg', 'https://lg.com', 1, 2, 'LG Electronics', 'Innovative home appliances and electronics', 'lg, electronics, appliances', '0000-00-00 00:00:00', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.00),
(3, 'Whirlpool', 'whirlpool', 'Trusted home appliance manufacturer', 'http://localhost:5000/uploads/brands/brand-1755983730672-929170786.jpg', 'http://localhost:5000/uploads/brands/whirlpool-banner.jpg', 'https://whirlpool.com', 1, 3, 'Whirlpool Appliances', 'Trusted home appliance manufacturer', 'whirlpool, appliances, home', '0000-00-00 00:00:00', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.00),
(4, 'Bosch', 'bosch', 'Premium German engineering for home appliances', 'http://localhost:5000/uploads/brands/brand-1755882682399-606248210.jpeg', 'http://localhost:5000/uploads/brands/bosch-banner.jpg', 'https://bosch.com', 1, 4, 'Bosch Home Appliances', 'Premium German engineering for home appliances', 'bosch, german, premium, appliances', '0000-00-00 00:00:00', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.00),
(5, 'Philips', 'philips', 'Quality lighting and home care products', 'http://localhost:5000/uploads/brands/brand-1755883618471-749353359.jpg', 'http://localhost:5000/uploads/brands/philips-banner.jpg', 'https://philips.com', 1, 5, 'Philips Home Products', 'Quality lighting and home care products', 'philips, lighting, home care', '0000-00-00 00:00:00', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.00),
(6, 'shopzeo', 'shopzeo', 'delhi', 'http://localhost:5000/uploads/brands/brand-1755882682399-606248210.jpeg', NULL, 'www.test.com', 1, 0, NULL, NULL, NULL, '2025-08-22 17:11:22', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'prabhatkumarmrj834@gmail.com', '+919005988152', NULL, 'india', 2025, 0, 0, 0.00),
(7, 'qqqq', 'qqqq', 'fghgfh', 'http://localhost:5000/uploads/brands/brand-1755883618471-749353359.jpg', NULL, 'https://www.samsung.com', 1, 0, NULL, NULL, NULL, '2025-08-22 17:26:59', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'prabhatkumarmrj834@gmail.com', '+919005988152', NULL, 'India', 4446, 0, 0, 0.00),
(8, 'Dream Craft ', 'dream-craft', 'Dreamcraft descriptionn ', 'http://localhost:5000/uploads/brands/brand-1755983730672-929170786.jpg', NULL, 'www.dreamcraft.com', 1, 0, NULL, NULL, NULL, '2025-08-23 21:15:30', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'test@gmail.com', '+919005988152', NULL, 'India', 2012, 0, 0, 0.00),
(9, 'apple', 'apple', 'ghfhfh', 'http://localhost:5000/uploads/brands/brand-1756002068669-187553850.png', NULL, 'www.com', 0, 0, NULL, NULL, NULL, '2025-08-24 02:21:08', '2025-08-24 20:46:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'test@gmail.com', '22515151151', NULL, 'india', 2024, 0, 0, 0.00),
(10, 'mindmanthan', 'mindmanthan', 'mindmanthan', 'http://localhost:5000/uploads/brands/brand-1756026402979-320002357.jpeg', NULL, 'mindmanthan.com', 1, 0, NULL, NULL, NULL, '2025-08-24 09:06:43', '2025-08-24 09:37:53', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'hr@gmail.com', '48578374578578', NULL, 'india', 2024, 0, 0, 0.00),
(11, 'New luxcare', 'new-luxcare', 'Description of brand new luxcare', NULL, NULL, 'lyca.com', 1, 0, NULL, NULL, NULL, '2025-08-24 20:49:45', '2025-08-24 20:51:48', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lyca@gmail.com', '555555555555', NULL, 'India', 2024, 0, 0, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL COMMENT 'Category description',
  `image` varchar(500) DEFAULT NULL COMMENT 'Category image path',
  `parent_id` int(11) DEFAULT NULL COMMENT 'Parent category ID for subcategories',
  `level` int(11) DEFAULT 1 COMMENT 'Category level (1=main, 2=sub, 3=sub-sub)',
  `sort_order` int(11) DEFAULT 0 COMMENT 'Display priority order',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Category status',
  `meta_title` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` text DEFAULT NULL COMMENT 'SEO meta description',
  `meta_keywords` text DEFAULT NULL COMMENT 'SEO meta keywords',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image`, `parent_id`, `level`, `sort_order`, `is_active`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`) VALUES
(1, 'Electronics', 'electronics', 'Electronic devices and gadgets', NULL, NULL, 1, 1, 1, 'Electronics', 'Best electronic products', 'electronics, gadgets, devices', '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(2, 'Clothing', 'clothing', 'Fashion and apparel', NULL, NULL, 1, 2, 1, 'Clothing', 'Trendy fashion items', 'clothing, fashion, apparel', '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(3, 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', NULL, NULL, 1, 3, 1, 'Home & Garden', 'Home and garden products', 'home, garden, improvement', '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(4, 'Automotive', 'automotive', 'Car parts and accessories', NULL, NULL, 1, 4, 1, 'Automotive', 'Automotive products', 'automotive, car, parts', '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(5, 'Health & Beauty', 'health-beauty', 'Health and beauty products', NULL, NULL, 1, 5, 1, 'Health & Beauty', 'Health and beauty items', 'health, beauty, wellness', '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(6, 'Toys & Games', 'toys-games', 'Toys and games for all ages', NULL, NULL, 1, 6, 1, 'Toys & Games', 'Fun toys and games', 'toys, games, entertainment', '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(11, 'Test Category', 'test-category', 'Test Description', NULL, NULL, 1, 0, 1, NULL, NULL, NULL, '2025-08-21 17:10:37', '2025-08-21 17:10:37'),
(12, 'Test Category 3', 'test-category-3', 'Test Description 3', NULL, NULL, 1, 5, 1, NULL, NULL, NULL, '2025-08-21 17:32:54', '2025-08-21 17:32:54'),
(13, 'Test Category 4', 'test-category-4', 'Test Description 4', NULL, NULL, 1, 15, 1, NULL, NULL, NULL, '2025-08-21 17:44:54', '2025-08-21 17:44:54'),
(14, 'developer', 'developer', 'pkr', NULL, NULL, 1, 1, 1, NULL, NULL, NULL, '2025-08-21 18:00:07', '2025-08-21 18:00:07'),
(15, 'mobile shopzeo', 'mobile-shopzeo', 'gfdty', NULL, NULL, 1, 0, 1, NULL, NULL, NULL, '2025-08-21 18:49:04', '2025-08-21 18:49:04'),
(16, 'new category test', 'new-category-test', 'demo categoery test here', NULL, NULL, 1, 0, 1, NULL, NULL, NULL, '2025-08-21 18:51:40', '2025-08-21 18:51:40'),
(17, 'chips', 'chips', 'de', NULL, NULL, 1, 0, 1, NULL, NULL, NULL, '2025-08-23 21:06:15', '2025-08-23 21:06:15'),
(18, 'minds', 'minds', 'fsgd', 'http://localhost:5000/uploads/categories/1756029722553-3kwhir7wuah.png', NULL, 1, 3, 1, NULL, NULL, NULL, '2025-08-24 10:02:02', '2025-08-24 10:02:02'),
(19, 'vivo', 'vivo', 'etst', 'http://localhost:5000/uploads/categories/category-1756046933837-522765053.png', 15, 2, 3, 1, NULL, NULL, NULL, '2025-08-24 14:48:53', '2025-08-24 14:48:53'),
(20, 'EYE WEAR', 'eye-wear', 'SAFE EYE BETTER WORLD', 'http://localhost:5000/uploads/categories/category-1756069572481-100421237.webp', NULL, 1, 2, 1, NULL, NULL, NULL, '2025-08-24 21:06:12', '2025-08-24 21:06:12'),
(21, 'HANS ', 'hans-', 'HAJS', 'http://localhost:5000/uploads/categories/category-1756069696021-640900141.png', NULL, 1, 2, 1, NULL, NULL, NULL, '2025-08-24 21:08:16', '2025-08-24 21:08:16');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `customer_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `store_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `delivery_man_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` enum('pending','confirmed','packaging','out_for_delivery','delivered','returned','failed','cancelled') NOT NULL DEFAULT 'pending',
  `order_type` enum('inhouse','vendor') NOT NULL DEFAULT 'vendor',
  `payment_status` enum('pending','paid','failed','refunded','partially_refunded') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(100) DEFAULT NULL,
  `payment_gateway` varchar(100) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `commission_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `vendor_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(3) NOT NULL DEFAULT 'USD',
  `exchange_rate` decimal(10,6) NOT NULL DEFAULT 1.000000,
  `shipping_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`shipping_address`)),
  `billing_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`billing_address`)),
  `shipping_method` varchar(100) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL,
  `estimated_delivery` datetime DEFAULT NULL,
  `actual_delivery` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(500) NOT NULL,
  `slug` varchar(500) DEFAULT NULL COMMENT 'URL-friendly product name',
  `description` text DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `store_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL COMMENT 'Cost price for margin calculation',
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_reviews` int(11) DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `product_code` varchar(100) NOT NULL COMMENT 'Unique product code',
  `amazon_asin` varchar(20) DEFAULT NULL COMMENT 'Amazon ASIN if applicable',
  `sku_id` varchar(100) DEFAULT NULL COMMENT 'Stock Keeping Unit',
  `selling_price` decimal(10,2) NOT NULL,
  `mrp` decimal(10,2) DEFAULT NULL COMMENT 'Maximum Retail Price',
  `quantity` int(11) NOT NULL DEFAULT 0,
  `packaging_length` decimal(8,2) DEFAULT NULL COMMENT 'Length in cm',
  `packaging_breadth` decimal(8,2) DEFAULT NULL COMMENT 'Breadth in cm',
  `packaging_height` decimal(8,2) DEFAULT NULL COMMENT 'Height in cm',
  `packaging_weight` decimal(8,3) DEFAULT NULL COMMENT 'Weight in kg',
  `gst_percentage` decimal(5,2) DEFAULT 0.00 COMMENT 'GST percentage',
  `image_1` varchar(500) DEFAULT NULL,
  `image_2` varchar(500) DEFAULT NULL,
  `image_3` varchar(500) DEFAULT NULL,
  `image_4` varchar(500) DEFAULT NULL,
  `image_5` varchar(500) DEFAULT NULL,
  `image_6` varchar(500) DEFAULT NULL,
  `image_7` varchar(500) DEFAULT NULL,
  `image_8` varchar(500) DEFAULT NULL,
  `image_9` varchar(500) DEFAULT NULL,
  `image_10` varchar(500) DEFAULT NULL,
  `video_1` varchar(500) DEFAULT NULL,
  `video_2` varchar(500) DEFAULT NULL,
  `product_type` varchar(100) DEFAULT NULL,
  `size_type` varchar(50) DEFAULT NULL,
  `size` varchar(100) DEFAULT NULL,
  `colour` varchar(100) DEFAULT NULL,
  `return_exchange_condition` text DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT 1 COMMENT 'Product visibility status',
  `size_chart` varchar(500) DEFAULT NULL COMMENT 'Size chart image path',
  `pickup_point` varchar(255) DEFAULT NULL,
  `hsn_code` varchar(20) DEFAULT NULL COMMENT 'HSN code for GST',
  `customisation_id` varchar(100) DEFAULT NULL,
  `associated_pixel` varchar(255) DEFAULT NULL,
  `attr1_attribute_name` varchar(255) DEFAULT NULL,
  `attr2_attribute_name` varchar(255) DEFAULT NULL,
  `attr3_attribute_name` varchar(255) DEFAULT NULL,
  `attr4_attribute_name` varchar(255) DEFAULT NULL,
  `attr5_attribute_name` varchar(255) DEFAULT NULL,
  `collection_1` varchar(255) DEFAULT NULL,
  `collection_2` varchar(255) DEFAULT NULL,
  `collection_3` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_home_product` tinyint(1) DEFAULT 0,
  `total_sold` int(11) DEFAULT 0,
  `sub_category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `category_id`, `store_id`, `cost_price`, `rating`, `total_reviews`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`, `product_code`, `amazon_asin`, `sku_id`, `selling_price`, `mrp`, `quantity`, `packaging_length`, `packaging_breadth`, `packaging_height`, `packaging_weight`, `gst_percentage`, `image_1`, `image_2`, `image_3`, `image_4`, `image_5`, `image_6`, `image_7`, `image_8`, `image_9`, `image_10`, `video_1`, `video_2`, `product_type`, `size_type`, `size`, `colour`, `return_exchange_condition`, `visibility`, `size_chart`, `pickup_point`, `hsn_code`, `customisation_id`, `associated_pixel`, `attr1_attribute_name`, `attr2_attribute_name`, `attr3_attribute_name`, `attr4_attribute_name`, `attr5_attribute_name`, `collection_1`, `collection_2`, `collection_3`, `is_active`, `is_featured`, `is_home_product`, `total_sold`, `sub_category_id`) VALUES
('', 'Gaming Mouse RGB', NULL, '\"Ergonomic gaming mouse with customizable RGB lighting and 16000 DPI\"', 16, 'ce32fe90-7eaa-11f0-a328-f5704f3e47ab', 2800.00, 0.00, 0, NULL, NULL, NULL, '2025-08-24 10:56:03', '2025-08-24 10:56:03', 'PROD003', 'B06ABC5678', 'SKU-WEE001', 3999.00, 4999.00, 150, 12.50, 6.50, 4.00, 0.120, 18.00, 'http://localhost:5000/uploads/products/wireless-earbuds-elite-1.jpg', '', '', '', '', '', '', '', '', 'Electronics', 'One Size', 'White', '\"7 days return', NULL, '1 year warranty\"', '8518', 'WEE-CUST', 1, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 19),
('542e250d-7eab-11f0-a328-f5704f3e47ab', 'Test Product', 'test-product', 'Test description', 1, 'ce32fe90-7eaa-11f0-a328-f5704f3e47ab', 100.00, 0.00, 0, 'Test Product', 'Test description', 'test', '2025-08-21 16:24:45', '2025-08-21 16:24:45', 'TEST001', 'B08TEST', 'SKUTEST', 150.00, 200.00, 10, 10.00, 5.00, 2.00, 0.500, 18.00, 'https://example.com/test1.jpg', 'https://example.com/test2.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Test Type', NULL, 'M', 'Blue', '7 days return', 1, 'https://example.com/sizechart.jpg', NULL, '1234', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, 0, 0, 19);

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `logo` varchar(500) DEFAULT NULL COMMENT 'Store logo image path',
  `banner` varchar(500) DEFAULT NULL COMMENT 'Store banner image path',
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00 COMMENT 'Store rating (0-5)',
  `total_orders` int(11) DEFAULT 0,
  `commission_rate` decimal(5,2) DEFAULT 15.00 COMMENT 'Platform commission percentage',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `owner_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `gst_number` varchar(20) DEFAULT NULL COMMENT 'GST registration number',
  `gst_percentage` decimal(5,2) DEFAULT 0.00 COMMENT 'Default GST percentage for store',
  `is_active` tinyint(1) DEFAULT 1,
  `is_verified` tinyint(1) DEFAULT 0 COMMENT 'Store verification status',
  `total_products` int(11) DEFAULT 0,
  `total_revenue` decimal(15,2) DEFAULT 0.00,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `city` varchar(100) NOT NULL DEFAULT 'India',
  `state` varchar(100) NOT NULL DEFAULT 'Maharashtra',
  `country` varchar(100) NOT NULL DEFAULT 'India',
  `postal_code` varchar(20) NOT NULL DEFAULT '400001',
  `pan_number` varchar(10) DEFAULT NULL,
  `business_type` enum('individual','partnership','company','llp') NOT NULL DEFAULT 'individual'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `slug`, `description`, `logo`, `banner`, `phone`, `email`, `address`, `rating`, `total_orders`, `commission_rate`, `created_at`, `updated_at`, `owner_id`, `gst_number`, `gst_percentage`, `is_active`, `is_verified`, `total_products`, `total_revenue`, `meta_title`, `meta_description`, `meta_keywords`, `city`, `state`, `country`, `postal_code`, `pan_number`, `business_type`) VALUES
('6dbc4add-9e92-4346-a692-2352c2cff2a0', 'SANJU DADA', 'sanju-dada', 'DESCRIPTUON', NULL, NULL, '998877665544', 'sanjida@gmail.com', 'Karnataka', 0.00, 0, 5.00, '2025-08-24 21:10:25', '2025-08-24 21:10:25', '993be4cb-1380-48fd-93ba-6f1a9af2e3d9', 'ASDFHFKJFDKJGFH', 18.00, 1, 0, 0, 0.00, 'SANJU DADA - Online Store', 'DESCRIPTUON', 'SANJU DADA, online store, shopping, individual', 'jdnjdhn', 'karnataka', 'India', '654846', 'JSBFDSFFGJ', 'individual'),
('beddb278-a7b1-4e80-8eb4-c10934071003', 'rimmi', 'rimmi', 'dfhgf', NULL, NULL, '555555555555', 'rimmi@gmail.com', 'sihabhar maharajganj', 0.00, 0, 5.00, '2025-08-24 21:02:24', '2025-08-24 21:02:24', '29b01c06-cb18-415b-8b2b-402271a94e96', 'AJHDJDB BERVDG0', 18.00, 1, 0, 0, 0.00, 'rimmi - Online Store', 'dfhgf', 'rimmi, online store, shopping, individual', 'Maharajganj', 'Uttar Pradesh', 'India', '273305', 'PUMPHSHGWD', 'individual'),
('ce32fe90-7eaa-11f0-a328-f5704f3e47ab', 'Test Store', 'test-store', 'A test store for testing', NULL, NULL, '+1234567890', 'test@store.com', '123 Test Street', 0.00, 0, 15.00, '2025-08-21 16:21:01', '2025-08-24 20:12:48', '97c7cc00-64b1-46d1-9b1c-a3cb8dc24ce3', 'GST123', 18.00, 1, 1, 0, 0.00, 'Test Store', 'Test store description', 'test, store', 'India', 'Maharashtra', 'India', '400001', NULL, 'individual');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT 'Sub category name in English',
  `slug` varchar(255) NOT NULL COMMENT 'URL-friendly sub category name',
  `priority` int(11) DEFAULT 0 COMMENT 'Display priority order',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Sub category status',
  `category_id` int(11) NOT NULL COMMENT 'Parent category ID',
  `meta_title` varchar(255) DEFAULT NULL COMMENT 'SEO meta title',
  `meta_description` text DEFAULT NULL COMMENT 'SEO meta description',
  `meta_keywords` text DEFAULT NULL COMMENT 'SEO meta keywords',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Product sub categories table';

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`id`, `name`, `slug`, `priority`, `is_active`, `category_id`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`) VALUES
(19, 'Smartphones', 'smartphones', 1, 1, 1, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(20, 'Laptops', 'laptops', 2, 1, 1, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(21, 'Tablets', 'tablets', 3, 1, 1, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(22, 'Men\'s Clothing', 'mens-clothing', 1, 1, 2, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(23, 'Women\'s Clothing', 'womens-clothing', 2, 1, 2, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(24, 'Kids\'s Clothing', 'kids-clothing', 3, 1, 2, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(25, 'Furniture', 'furniture', 1, 1, 3, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(26, 'Kitchen & Dining', 'kitchen-dining', 2, 1, 3, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(27, 'Garden Tools', 'garden-tools', 3, 1, 3, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(28, 'Car Care & Detailing', 'car-care-detailing', 1, 1, 4, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(29, 'Car Electronics', 'car-electronics', 2, 1, 4, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(30, 'Auto Parts', 'auto-parts', 3, 1, 4, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(31, 'Skincare', 'skincare', 1, 1, 5, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(32, 'Makeup', 'makeup', 2, 1, 5, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(33, 'Hair Care', 'hair-care', 3, 1, 5, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(34, 'Board Games', 'board-games', 1, 1, 6, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(35, 'Video Games', 'video-games', 2, 1, 6, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(36, 'Educational Toys', 'educational-toys', 3, 1, 6, NULL, NULL, NULL, '2025-08-20 09:14:18', '2025-08-20 09:14:18'),
(37, 'Men\'s Wear', 'mens-wear', 1, 1, 2, 'Men\'s Clothing', 'Men\'s fashion', 'men, clothing, fashion', '2025-08-21 16:09:13', '2025-08-21 16:09:13'),
(38, 'Women\'s Wear', 'womens-wear', 2, 1, 2, 'Women\'s Clothing', 'Women\'s fashion', 'women, clothing, fashion', '2025-08-21 16:09:13', '2025-08-21 16:09:13'),
(45, 'Audio Devices', 'audio-devices', 3, 1, 1, 'Audio Devices - Headphones & Speakers', 'Premium audio devices for music lovers', 'headphones, speakers, audio, music', '2025-08-24 11:10:34', '2025-08-24 11:10:34'),
(46, 'Wearables', 'wearables', 4, 1, 1, 'Wearables - Smartwatches & Fitness Trackers', 'Smart wearables for health and fitness', 'smartwatch, fitness tracker, wearable', '2025-08-24 11:10:34', '2025-08-24 11:10:34'),
(47, 'Gaming', 'gaming', 5, 1, 1, 'Gaming - Gaming Accessories & Equipment', 'Professional gaming gear and accessories', 'gaming, mouse, keyboard, accessories', '2025-08-24 11:10:34', '2025-08-24 11:10:34'),
(48, 'Cold drinks', 'cold-drinks', 2, 1, 20, NULL, NULL, NULL, '2025-08-24 21:37:45', '2025-08-24 21:37:45'),
(49, 'prabhat paswan', 'prabhat-paswan', 1, 1, 2, NULL, NULL, NULL, '2025-08-24 21:38:08', '2025-08-24 21:38:08'),
(50, 'abc communication', 'abc-communication', 4, 1, 20, NULL, NULL, NULL, '2025-08-24 21:54:18', '2025-08-24 21:54:18'),
(51, 'kids shoes', 'kids-shoes', 1, 1, 2, NULL, NULL, NULL, '2025-08-24 21:55:08', '2025-08-24 21:55:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `role` enum('admin','vendor','customer','delivery') DEFAULT 'customer',
  `address` text DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_verified` tinyint(1) DEFAULT 0,
  `email_verified_at` datetime DEFAULT NULL,
  `phone_verified_at` datetime DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'India',
  `postal_code` varchar(20) DEFAULT NULL,
  `default_shipping_address` text DEFAULT NULL,
  `default_billing_address` text DEFAULT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`, `phone`, `role`, `address`, `date_of_birth`, `gender`, `created_at`, `updated_at`, `is_active`, `is_verified`, `email_verified_at`, `phone_verified_at`, `last_login_at`, `profile_image`, `city`, `state`, `country`, `postal_code`, `default_shipping_address`, `default_billing_address`, `preferences`) VALUES
('', 'hr@gmail.com', '$2a$12$5CUXfQNuA7/LpW78C4Vjl.XkOnPQMYzNN7fUpcJ3MAYJuBcRKs0De', 'Mindmanthan', 'User', '09005988152', 'vendor', 'Mindware,Pankaj plaza, pocket-7, sector-12, Dwarka, New Delhi India,110078,', NULL, NULL, '2025-08-24 19:15:18', '2025-08-24 19:15:18', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, NULL, NULL, NULL),
('29b01c06-cb18-415b-8b2b-402271a94e96', 'rimmi@gmail.com', '$2a$12$hOGQbf0fAWCaHpHNc7EFDONss66eseMbF635zi5CW0XPsDNYLajNe', 'rimmi', 'User', '555555555555', 'vendor', 'sihabhar maharajganj', NULL, NULL, '2025-08-24 21:02:23', '2025-08-24 21:02:23', 1, 0, NULL, NULL, NULL, NULL, 'Maharajganj', 'Uttar Pradesh', 'India', '273305', NULL, NULL, '{}'),
('97c7cc00-64b1-46d1-9b1c-a3cb8dc24ce3', 'john.doe@example.com', '$2a$12$9Yc.AQXim8I2ds0cpihPuOqXri0hE3TDnCnUtn/N.eHRjBTh0dIlW', 'John', 'Doe', '', 'customer', NULL, NULL, NULL, '2025-08-19 20:51:34', '2025-08-19 20:51:34', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, 'India', NULL, NULL, NULL, NULL),
('993be4cb-1380-48fd-93ba-6f1a9af2e3d9', 'sanjida@gmail.com', '$2a$12$gF2cgJgEqVVKyNe5/.eZh.Ze0OyGRmjH//IXG2mTRrx1AT6dF84qa', 'SANJU', 'DADA', '998877665544', 'vendor', 'Karnataka', NULL, NULL, '2025-08-24 21:10:24', '2025-08-24 21:10:24', 1, 0, NULL, NULL, NULL, NULL, 'jdnjdhn', 'karnataka', 'India', '654846', NULL, NULL, '{}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_isActive` (`isActive`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_banner_type` (`banner_type`),
  ADD KEY `idx_banner_active` (`is_active`),
  ADD KEY `idx_banner_featured` (`is_featured`),
  ADD KEY `idx_banner_sort_order` (`sort_order`),
  ADD KEY `idx_banner_dates` (`start_date`,`end_date`),
  ADD KEY `idx_banner_resource` (`resource_type`,`resource_id`),
  ADD KEY `banners_banner_type` (`banner_type`),
  ADD KEY `banners_resource_type` (`resource_type`),
  ADD KEY `banners_resource_id` (`resource_id`),
  ADD KEY `banners_is_active` (`is_active`),
  ADD KEY `banners_is_featured` (`is_featured`),
  ADD KEY `banners_sort_order` (`sort_order`),
  ADD KEY `banners_start_date` (`start_date`),
  ADD KEY `banners_end_date` (`end_date`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD UNIQUE KEY `slug_12` (`slug`),
  ADD UNIQUE KEY `slug_13` (`slug`),
  ADD UNIQUE KEY `slug_14` (`slug`),
  ADD UNIQUE KEY `slug_15` (`slug`),
  ADD UNIQUE KEY `slug_16` (`slug`),
  ADD UNIQUE KEY `slug_17` (`slug`),
  ADD UNIQUE KEY `slug_18` (`slug`),
  ADD UNIQUE KEY `slug_19` (`slug`),
  ADD UNIQUE KEY `slug_20` (`slug`),
  ADD UNIQUE KEY `slug_21` (`slug`),
  ADD UNIQUE KEY `slug_22` (`slug`),
  ADD UNIQUE KEY `slug_23` (`slug`),
  ADD UNIQUE KEY `slug_24` (`slug`),
  ADD UNIQUE KEY `slug_25` (`slug`),
  ADD UNIQUE KEY `slug_26` (`slug`),
  ADD UNIQUE KEY `slug_27` (`slug`),
  ADD UNIQUE KEY `slug_28` (`slug`),
  ADD UNIQUE KEY `slug_29` (`slug`),
  ADD UNIQUE KEY `slug_30` (`slug`),
  ADD UNIQUE KEY `slug_31` (`slug`),
  ADD UNIQUE KEY `slug_32` (`slug`),
  ADD UNIQUE KEY `slug_33` (`slug`),
  ADD UNIQUE KEY `slug_34` (`slug`),
  ADD UNIQUE KEY `slug_35` (`slug`),
  ADD UNIQUE KEY `slug_36` (`slug`),
  ADD UNIQUE KEY `slug_37` (`slug`),
  ADD UNIQUE KEY `slug_38` (`slug`),
  ADD UNIQUE KEY `slug_39` (`slug`),
  ADD UNIQUE KEY `slug_40` (`slug`),
  ADD UNIQUE KEY `slug_41` (`slug`),
  ADD UNIQUE KEY `slug_42` (`slug`),
  ADD UNIQUE KEY `slug_43` (`slug`),
  ADD UNIQUE KEY `slug_44` (`slug`),
  ADD UNIQUE KEY `slug_45` (`slug`),
  ADD UNIQUE KEY `slug_46` (`slug`),
  ADD UNIQUE KEY `slug_47` (`slug`),
  ADD UNIQUE KEY `slug_48` (`slug`),
  ADD KEY `brands_slug` (`slug`),
  ADD KEY `brands_name` (`name`),
  ADD KEY `brands_is_active` (`is_active`),
  ADD KEY `brands_is_featured` (`is_featured`),
  ADD KEY `brands_sort_order` (`sort_order`),
  ADD KEY `brands_country` (`country`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD UNIQUE KEY `slug_12` (`slug`),
  ADD UNIQUE KEY `slug_13` (`slug`),
  ADD UNIQUE KEY `slug_14` (`slug`),
  ADD UNIQUE KEY `slug_15` (`slug`),
  ADD UNIQUE KEY `slug_16` (`slug`),
  ADD UNIQUE KEY `slug_17` (`slug`),
  ADD UNIQUE KEY `slug_18` (`slug`),
  ADD UNIQUE KEY `slug_19` (`slug`),
  ADD UNIQUE KEY `slug_20` (`slug`),
  ADD UNIQUE KEY `slug_21` (`slug`),
  ADD UNIQUE KEY `slug_22` (`slug`),
  ADD UNIQUE KEY `slug_23` (`slug`),
  ADD UNIQUE KEY `slug_24` (`slug`),
  ADD UNIQUE KEY `slug_25` (`slug`),
  ADD UNIQUE KEY `slug_26` (`slug`),
  ADD UNIQUE KEY `slug_27` (`slug`),
  ADD UNIQUE KEY `slug_28` (`slug`),
  ADD UNIQUE KEY `slug_29` (`slug`),
  ADD UNIQUE KEY `slug_30` (`slug`),
  ADD UNIQUE KEY `slug_31` (`slug`),
  ADD UNIQUE KEY `slug_32` (`slug`),
  ADD UNIQUE KEY `slug_33` (`slug`),
  ADD UNIQUE KEY `slug_34` (`slug`),
  ADD UNIQUE KEY `slug_35` (`slug`),
  ADD UNIQUE KEY `slug_36` (`slug`),
  ADD UNIQUE KEY `slug_37` (`slug`),
  ADD UNIQUE KEY `slug_38` (`slug`),
  ADD UNIQUE KEY `slug_39` (`slug`),
  ADD UNIQUE KEY `slug_40` (`slug`),
  ADD UNIQUE KEY `slug_41` (`slug`),
  ADD UNIQUE KEY `slug_42` (`slug`),
  ADD UNIQUE KEY `slug_43` (`slug`),
  ADD UNIQUE KEY `slug_44` (`slug`),
  ADD UNIQUE KEY `slug_45` (`slug`),
  ADD UNIQUE KEY `slug_46` (`slug`),
  ADD UNIQUE KEY `slug_47` (`slug`),
  ADD UNIQUE KEY `slug_48` (`slug`),
  ADD UNIQUE KEY `slug_49` (`slug`),
  ADD UNIQUE KEY `slug_50` (`slug`),
  ADD UNIQUE KEY `slug_51` (`slug`),
  ADD UNIQUE KEY `slug_52` (`slug`),
  ADD UNIQUE KEY `slug_53` (`slug`),
  ADD UNIQUE KEY `slug_54` (`slug`),
  ADD KEY `categories_slug` (`slug`),
  ADD KEY `categories_parent_id` (`parent_id`),
  ADD KEY `categories_level` (`level`),
  ADD KEY `categories_is_active` (`is_active`),
  ADD KEY `categories_sort_order` (`sort_order`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD UNIQUE KEY `order_number_2` (`order_number`),
  ADD UNIQUE KEY `order_number_3` (`order_number`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD KEY `products_product_code` (`product_code`),
  ADD KEY `products_store_id` (`store_id`),
  ADD KEY `products_category_id` (`category_id`),
  ADD KEY `products_sub_category_id` (`sub_category_id`),
  ADD KEY `products_is_active` (`is_active`),
  ADD KEY `products_is_featured` (`is_featured`),
  ADD KEY `products_rating` (`rating`),
  ADD KEY `products_selling_price` (`selling_price`),
  ADD KEY `products_name` (`name`),
  ADD KEY `products_hsn_code` (`hsn_code`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD UNIQUE KEY `slug_12` (`slug`),
  ADD UNIQUE KEY `slug_13` (`slug`),
  ADD UNIQUE KEY `slug_14` (`slug`),
  ADD UNIQUE KEY `slug_15` (`slug`),
  ADD UNIQUE KEY `slug_16` (`slug`),
  ADD UNIQUE KEY `slug_17` (`slug`),
  ADD UNIQUE KEY `slug_18` (`slug`),
  ADD UNIQUE KEY `slug_19` (`slug`),
  ADD UNIQUE KEY `slug_20` (`slug`),
  ADD UNIQUE KEY `slug_21` (`slug`),
  ADD UNIQUE KEY `slug_22` (`slug`),
  ADD UNIQUE KEY `slug_23` (`slug`),
  ADD UNIQUE KEY `slug_24` (`slug`),
  ADD UNIQUE KEY `slug_25` (`slug`),
  ADD UNIQUE KEY `slug_26` (`slug`),
  ADD UNIQUE KEY `slug_27` (`slug`),
  ADD UNIQUE KEY `slug_28` (`slug`),
  ADD UNIQUE KEY `slug_29` (`slug`),
  ADD UNIQUE KEY `slug_30` (`slug`),
  ADD UNIQUE KEY `slug_31` (`slug`),
  ADD UNIQUE KEY `slug_32` (`slug`),
  ADD UNIQUE KEY `slug_33` (`slug`),
  ADD UNIQUE KEY `slug_34` (`slug`),
  ADD UNIQUE KEY `slug_35` (`slug`),
  ADD UNIQUE KEY `slug_36` (`slug`),
  ADD UNIQUE KEY `slug_37` (`slug`),
  ADD UNIQUE KEY `slug_38` (`slug`),
  ADD UNIQUE KEY `slug_39` (`slug`),
  ADD UNIQUE KEY `slug_40` (`slug`),
  ADD UNIQUE KEY `slug_41` (`slug`),
  ADD UNIQUE KEY `slug_42` (`slug`),
  ADD UNIQUE KEY `slug_43` (`slug`),
  ADD UNIQUE KEY `slug_44` (`slug`),
  ADD UNIQUE KEY `slug_45` (`slug`),
  ADD UNIQUE KEY `slug_46` (`slug`),
  ADD UNIQUE KEY `slug_47` (`slug`),
  ADD UNIQUE KEY `slug_48` (`slug`),
  ADD UNIQUE KEY `slug_49` (`slug`),
  ADD UNIQUE KEY `slug_50` (`slug`),
  ADD UNIQUE KEY `slug_51` (`slug`),
  ADD UNIQUE KEY `slug_52` (`slug`),
  ADD UNIQUE KEY `slug_53` (`slug`),
  ADD UNIQUE KEY `slug_54` (`slug`),
  ADD UNIQUE KEY `slug_55` (`slug`),
  ADD UNIQUE KEY `unique_store_name` (`name`),
  ADD UNIQUE KEY `unique_store_slug` (`slug`),
  ADD UNIQUE KEY `unique_store_email` (`email`),
  ADD KEY `stores_slug` (`slug`),
  ADD KEY `stores_owner_id` (`owner_id`),
  ADD KEY `stores_is_active` (`is_active`),
  ADD KEY `stores_is_verified` (`is_verified`),
  ADD KEY `stores_rating` (`rating`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_sub_categories_slug` (`slug`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD UNIQUE KEY `slug_7` (`slug`),
  ADD UNIQUE KEY `slug_8` (`slug`),
  ADD UNIQUE KEY `slug_9` (`slug`),
  ADD UNIQUE KEY `slug_10` (`slug`),
  ADD UNIQUE KEY `slug_11` (`slug`),
  ADD UNIQUE KEY `slug_12` (`slug`),
  ADD UNIQUE KEY `slug_13` (`slug`),
  ADD UNIQUE KEY `slug_14` (`slug`),
  ADD UNIQUE KEY `slug_15` (`slug`),
  ADD UNIQUE KEY `slug_16` (`slug`),
  ADD UNIQUE KEY `slug_17` (`slug`),
  ADD UNIQUE KEY `slug_18` (`slug`),
  ADD UNIQUE KEY `slug_19` (`slug`),
  ADD UNIQUE KEY `slug_20` (`slug`),
  ADD UNIQUE KEY `slug_21` (`slug`),
  ADD UNIQUE KEY `slug_22` (`slug`),
  ADD UNIQUE KEY `slug_23` (`slug`),
  ADD UNIQUE KEY `slug_24` (`slug`),
  ADD UNIQUE KEY `slug_25` (`slug`),
  ADD UNIQUE KEY `slug_26` (`slug`),
  ADD UNIQUE KEY `slug_27` (`slug`),
  ADD UNIQUE KEY `slug_28` (`slug`),
  ADD UNIQUE KEY `slug_29` (`slug`),
  ADD UNIQUE KEY `slug_30` (`slug`),
  ADD UNIQUE KEY `slug_31` (`slug`),
  ADD UNIQUE KEY `slug_32` (`slug`),
  ADD UNIQUE KEY `slug_33` (`slug`),
  ADD UNIQUE KEY `slug_34` (`slug`),
  ADD UNIQUE KEY `slug_35` (`slug`),
  ADD UNIQUE KEY `slug_36` (`slug`),
  ADD UNIQUE KEY `slug_37` (`slug`),
  ADD UNIQUE KEY `slug_38` (`slug`),
  ADD UNIQUE KEY `slug_39` (`slug`),
  ADD UNIQUE KEY `slug_40` (`slug`),
  ADD UNIQUE KEY `slug_41` (`slug`),
  ADD UNIQUE KEY `slug_42` (`slug`),
  ADD UNIQUE KEY `slug_43` (`slug`),
  ADD UNIQUE KEY `slug_44` (`slug`),
  ADD UNIQUE KEY `slug_45` (`slug`),
  ADD UNIQUE KEY `slug_46` (`slug`),
  ADD UNIQUE KEY `slug_47` (`slug`),
  ADD UNIQUE KEY `slug_48` (`slug`),
  ADD UNIQUE KEY `slug_49` (`slug`),
  ADD KEY `idx_sub_categories_category_id` (`category_id`),
  ADD KEY `idx_sub_categories_is_active` (`is_active`),
  ADD KEY `idx_sub_categories_priority` (`priority`),
  ADD KEY `idx_sub_categories_created_at` (`created_at`),
  ADD KEY `idx_sub_categories_updated_at` (`updated_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD KEY `users_email` (`email`),
  ADD KEY `users_phone` (`phone`),
  ADD KEY `users_role` (`role`),
  ADD KEY `users_is_active` (`is_active`),
  ADD KEY `users_is_verified` (`is_verified`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_149` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_150` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_151` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
