-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2025 at 09:26 PM
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
-- Database: `shopzeo`
--

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `footer_text` text DEFAULT NULL,
  `minimum_order` decimal(24,2) NOT NULL DEFAULT 0.00,
  `comission` decimal(24,2) DEFAULT NULL,
  `schedule_order` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `vendor_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `free_delivery` tinyint(1) NOT NULL DEFAULT 0,
  `rating` varchar(255) DEFAULT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `delivery` tinyint(1) NOT NULL DEFAULT 1,
  `take_away` tinyint(1) NOT NULL DEFAULT 1,
  `item_section` tinyint(1) NOT NULL DEFAULT 1,
  `tax` decimal(24,2) NOT NULL DEFAULT 0.00,
  `zone_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reviews_section` tinyint(1) NOT NULL DEFAULT 1,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `off_day` varchar(191) NOT NULL DEFAULT ' ',
  `gst` varchar(191) DEFAULT NULL,
  `self_delivery_system` tinyint(1) NOT NULL DEFAULT 0,
  `pos_system` tinyint(1) NOT NULL DEFAULT 0,
  `minimum_shipping_charge` decimal(24,2) NOT NULL DEFAULT 0.00,
  `delivery_time` varchar(100) DEFAULT '30-40',
  `veg` tinyint(1) NOT NULL DEFAULT 1,
  `non_veg` tinyint(1) NOT NULL DEFAULT 1,
  `order_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_order` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `store_type` enum('quick_commerce','ecommerce','pharmacy') DEFAULT NULL,
  `store_id` varchar(50) DEFAULT NULL,
  `gstin` varchar(20) DEFAULT NULL,
  `pan` varchar(20) DEFAULT NULL,
  `aadhar` varchar(12) DEFAULT NULL,
  `purchase_invoice` varchar(255) DEFAULT NULL,
  `order_place_to_schedule_interval` int(11) DEFAULT 0,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `per_km_shipping_charge` double(16,3) UNSIGNED NOT NULL DEFAULT 0.000,
  `prescription_order` tinyint(1) NOT NULL DEFAULT 0,
  `slug` varchar(255) DEFAULT NULL,
  `maximum_shipping_charge` double(23,3) DEFAULT NULL,
  `cutlery` tinyint(1) NOT NULL DEFAULT 0,
  `meta_title` varchar(100) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_image` varchar(100) DEFAULT NULL,
  `announcement` tinyint(1) NOT NULL DEFAULT 0,
  `announcement_message` varchar(255) DEFAULT NULL,
  `store_business_model` enum('none','commission','subscription','unsubscribed') NOT NULL DEFAULT 'commission',
  `package_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `name`, `phone`, `email`, `logo`, `latitude`, `longitude`, `address`, `footer_text`, `minimum_order`, `comission`, `schedule_order`, `status`, `vendor_id`, `created_at`, `updated_at`, `free_delivery`, `rating`, `cover_photo`, `delivery`, `take_away`, `item_section`, `tax`, `zone_id`, `reviews_section`, `active`, `off_day`, `gst`, `self_delivery_system`, `pos_system`, `minimum_shipping_charge`, `delivery_time`, `veg`, `non_veg`, `order_count`, `total_order`, `module_id`, `store_type`, `store_id`, `gstin`, `pan`, `aadhar`, `purchase_invoice`, `order_place_to_schedule_interval`, `featured`, `per_km_shipping_charge`, `prescription_order`, `slug`, `maximum_shipping_charge`, `cutlery`, `meta_title`, `meta_description`, `meta_image`, `announcement`, `announcement_message`, `store_business_model`, `package_id`) VALUES
(1, 'Demo Store', '+101511111111', 'demo.store@gmail.com', '2023-08-16-64dca8ad238c4.png', '23.81695886557418', '90.36934144046135', 'House, road', NULL, 0.00, NULL, 0, 1, 1, '2023-08-15 23:45:01', '2025-02-28 14:21:07', 0, NULL, '2023-08-16-64dca8ad263f6.png', 1, 1, 1, 5.00, 1, 1, 1, ' ', NULL, 0, 0, 0.00, '30-40 min', 1, 1, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'demo-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(2, 'Tasty Lunch', '+917897654567', 'jhone@gmail.com', '2024-02-21-65d5bd5654a4f.png', '21.47938739423393', '80.39310522584688', 'House: 00, Road: 00, Streed:00, Test City', NULL, 100.00, NULL, 0, 1, 2, '2024-02-21 03:07:34', '2025-05-26 19:17:33', 0, NULL, '2024-02-21-65d5bd565807b.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '30-60 min', 1, 1, 0, 7, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'tasty-lunch', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(3, 'Tasty Takeaways', '+915678763456', 'sellerr@gmail.com', '2024-02-21-65d5bdd8eecc0.png', '23.408125816151216', '79.15256620958074', 'House: 00, Road: 00, Streed:00, Test City', NULL, 100.00, NULL, 0, 1, 3, '2024-02-21 03:09:44', '2025-02-28 14:21:07', 0, NULL, '2024-02-21-65d5bdd8f0aa2.png', 1, 1, 1, 10.00, 2, 1, 0, ' ', NULL, 0, 0, 0.00, '30-60 min', 1, 1, 0, 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'tasty-takeaways', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(4, 'Hungry Puppets', '+914567653423', 'sellerrr@gmail.com', '2024-02-21-65d5be5c6a7c7.png', '15.241732655183625', '76.34006620958074', 'House: 00, Road: 00, Test City', NULL, 100.00, NULL, 0, 1, 4, '2024-02-21 03:11:56', '2025-05-27 13:15:32', 0, NULL, '2024-02-21-65d5be5c6d905.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '30-60 min', 1, 1, 0, 5, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'hungry-puppets', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(5, 'The Capital Grill', '+917898654567', 'mysolution@gmailcom', '2024-02-21-65d5bef26698c.png', '17.881948038033492', '74.93381620958074', 'House: 00, Road: 00, Streed:00, Test City', NULL, 100.00, NULL, 0, 1, 5, '2024-02-21 03:14:26', '2025-06-28 20:22:26', 0, NULL, '2024-02-21-65d5bef2686a2.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '30-60 min', 1, 1, 0, 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'the-capital-grill', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(6, 'Miracle', '+915676435676', 'selerr@gmail.com', '2024-02-21-65d5ce5051c41.png', '30.26581085961716', '74.05490995958074', 'House: 00, Road: 00, City-000, Country', NULL, 0.00, NULL, 0, 1, 6, '2024-02-21 04:20:00', '2025-05-26 11:12:45', 0, NULL, '2024-02-21-65d5ce50565bc.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '5-7 days', 1, 1, 1, 4, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'miracle', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(7, 'Art Apparel', '+914534657865', 'john@gmail.com', '2024-02-21-65d5cef43d30b.png', '22.48038350976872', '73.52756620958074', 'House: 00, City-000, Country', NULL, 0.00, NULL, 0, 1, 7, '2024-02-21 04:22:44', '2025-03-22 14:35:44', 0, NULL, '2024-02-21-65d5cef43ea36.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '5-7 days', 1, 1, 0, 4, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'art-apparel', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(8, 'Royal Crown', '+915676453457', 'seler@gmail.com', '2024-02-21-65d5cf9aa851c.png', '23.963121680964846', '85.48069120958074', 'House: 00, Road: 00, City-000, Country', NULL, 0.00, NULL, 0, 1, 8, '2024-02-21 04:25:30', '2025-03-20 21:08:32', 0, NULL, '2024-02-21-65d5cf9aaadd8.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '5-7 days', 1, 1, 0, 2, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'royal-crown', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(9, 'Orderly Fashion', '+915645678765', 'johndoe@gmail.com', '2024-02-21-65d5d022a1ed3.png', '24.82091364449178', '78.27365995958074', 'House: 00, Road: 00, City-000, Country', NULL, 0.00, NULL, 0, 1, 9, '2024-02-21 04:27:46', '2025-02-28 14:21:07', 0, NULL, '2024-02-21-65d5d022a40fd.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '5-7 days', 1, 1, 0, 1, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'orderly-fashion', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(10, 'Infi-Health', '+915676543456', 'john123@gmail.com', '2024-02-21-65d5dca42e9c0.png', '22.13571646230066', '77.04319120958074', 'House: 00, Road: 00, City-0000, Country', NULL, 99.99, NULL, 0, 1, 10, '2024-02-21 05:21:08', '2025-07-04 21:58:51', 0, NULL, '2024-02-21-65d5dca433fee.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '2-4 days', 0, 0, 0, 2, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'infi-health', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(11, 'Medi Store', '+915676765645', 'jonny12@gmail.com', '2024-02-21-65d5dd579cd79.png', '14.668885117376586', '76.51584745958074', 'House: 00, Road: 00, City-0000, Country', NULL, 100.00, NULL, 0, 1, 11, '2024-02-21 05:24:07', '2025-02-28 14:21:07', 0, NULL, '2024-02-21-65d5dd579e9d2.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '2-4 days', 0, 0, 0, 0, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'medi-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(12, 'Medi Care', '+916787654346', 'jonnny343@gmail.com', '2024-02-21-65d5df10ac4ea.png', '18.49859139824792', '79.93816160750931', 'House: 00, Road: 00, City-0000, Country', NULL, 99.97, NULL, 0, 1, 12, '2024-02-21 05:31:28', '2025-02-28 14:21:07', 0, NULL, '2024-02-21-65d5df10b12fb.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '2-4 days', 0, 0, 0, 0, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'medi-care', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(13, 'Medi Mask', '+916787876756', 'john345@gmail.com', '2024-02-21-65d5dfd069d15.png', '23.21296107207733', '79.15256620958074', 'House: 00, Road: 00, City-0000, Country', NULL, 100.00, NULL, 0, 1, 13, '2024-02-21 05:34:40', '2025-02-28 14:21:07', 0, NULL, '2024-02-21-65d5dfd06bfc9.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '3-5 days', 0, 0, 0, 0, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0.000, 0, 'medi-mask', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(14, 'Organic Shop', '+916787564323', 'jony@gmail.com', '2024-02-21-65d5f472a50dd.png', '20.593684', '78.96288', 'House: 00, Road: 00, City-000, Country', NULL, 100.00, NULL, 0, 1, 14, '2024-02-21 07:02:42', '2025-02-28 14:21:07', 0, '{\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":1}', '2024-02-21-65d5f472a707a.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '5-7 days', 0, 0, 1, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'organic-shop', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(15, 'Eco Market', '+917898340969', 'john656@gmail.com', '2024-02-21-65d5f524e2d77.png', '22.874966492852618', '79.67990995958074', 'House: 00, Road: 00, City-000, Country', NULL, 100.00, NULL, 0, 1, 15, '2024-02-21 07:05:40', '2025-04-21 17:05:08', 0, NULL, '2024-02-21-65d5f524e505d.png', 1, 1, 1, 9.99, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '3-5 days', 0, 0, 0, 2, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'eco-market', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(16, 'Vegan Market', '+917876402945', 'diorr@gmail.com', '2024-02-21-65d5f5b2bc753.png', '18.32008916282663', '78.44944120958074', 'House: 00, Road: 00, City-000, Country', NULL, 99.98, NULL, 0, 1, 16, '2024-02-21 07:08:02', '2025-03-05 13:02:38', 0, NULL, '2024-02-21-65d5f5b2be6f9.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '5-7 days', 0, 0, 0, 0, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'vegan-market', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(17, 'Country Fair', '+917095357625', 'sdtv@gmail.com', '2024-02-21-65d5f669daff4.png', '31.539919227500835', '76.34006620958074', 'House: 00, Road: 00, City-000, Country', NULL, 100.00, NULL, 0, 1, 17, '2024-02-21 07:11:05', '2025-03-05 13:02:33', 0, NULL, '2024-02-21-65d5f669df7a5.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '4-6 days', 0, 0, 0, 0, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'country-fair', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(18, 'Fruit Valley', '+915687653421', '1234@gmail.com', '2024-02-22-65d655cec8d1d.png', '31.47728976109398', '75.98850370958074', 'India', NULL, 0.00, NULL, 0, 1, 18, '2024-02-22 01:28:06', '2025-04-03 10:54:10', 0, NULL, '2024-02-22-65d655cecb463.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '40-60 min', 1, 1, 0, 1, 7, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'fruit-valley', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(19, 'Borcelle', '+917898398745', 'johnyyyy@gmail.com', '2024-02-22-65d65693580c0.png', '13.758398695851955', '75.28537870958074', 'India', NULL, 0.00, NULL, 0, 1, 19, '2024-02-22 01:31:23', '2025-02-28 14:21:07', 0, NULL, '2024-02-22-65d656935c443.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '50-60 min', 1, 1, 0, 0, 7, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'borcelle', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(20, 'Fruit Store', '+915676342364', 'example@gmail.com', '2024-02-22-65d657495a193.png', '23.309374705798547', '87.23850370958074', 'India', NULL, 0.00, NULL, 0, 1, 20, '2024-02-22 01:34:25', '2025-02-28 14:21:07', 0, NULL, '2024-02-22-65d657495c8b5.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '30-60 min', 1, 1, 0, 0, 7, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'fruit-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(21, 'Fresh Market', '+914565231098', 'example345@gmail.com', '2024-02-22-65d65837010a1.png', '27.40257997040463', '73.17600370958074', 'India', NULL, 0.00, NULL, 0, 1, 21, '2024-02-22 01:38:23', '2025-02-28 14:21:07', 0, NULL, '2024-02-22-65d65837030a4.png', 1, 1, 1, 10.01, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '50-60 min', 1, 1, 0, 0, 7, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'fresh-market', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(22, 'Grocery store', '+911234876590', 'admin@test.com', '2024-06-09-6665600e2ded3.png', '24.865555623844898', '74.9708736093305', 'Delhi', NULL, 0.00, NULL, 0, 1, 22, '2024-06-09 13:25:58', '2025-03-05 13:02:27', 0, NULL, '2024-06-09-6665600e30700.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '5-7 days', 1, 1, 0, 0, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'grocery-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(23, 'Electronic', '9353932027', 'rajeshrasgulla@gmail.com', '2024-08-13-66bae6cb92767.png', '13.016999254276946', '77.70443335175514', '2P83+QQV, HV Residence, Krishnarajapuram, Bengaluru, Karnataka 560049, India', NULL, 0.00, NULL, 0, 1, 23, '2024-08-13 10:23:31', '2025-02-28 14:21:07', 0, NULL, '2024-08-13-66bae6cb94551.png', 1, 1, 1, 538386868855.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '13-16 minute', 1, 1, 0, 0, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'electronic', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(24, 'Jay Mata Di', '6203176139', 'satyamisha238@gmail.com', '2024-08-15-66bddb6bd8914.png', '26.588697743978443', '85.5012971162796', 'HGQ2+FGF, Sharif Colony, Sitamarhi, Bihar 843302, India', NULL, 0.00, NULL, 0, 1, 24, '2024-08-15 16:11:47', '2025-03-05 13:02:20', 0, NULL, '2024-08-15-66bddb6bda164.png', 1, 1, 1, 9464644464494949.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '10-12 minute', 1, 1, 0, 0, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'jay-mata-di', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(25, 'Kuchh', '8016763910', 'satyamkumar2716@gmail.com', '2024-08-15-66bde6600c386.png', '26.588697743978443', '85.5012971162796', 'HGQ2+FGF, Sharif Colony, Sitamarhi, Bihar 843302, India', NULL, 0.00, NULL, 0, 1, 25, '2024-08-15 16:58:32', '2025-03-05 17:47:39', 0, NULL, '2024-08-15-66bde6600d6b8.png', 1, 1, 1, 55555808.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '10-15 minute', 1, 1, 0, 0, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'kuchh', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(26, 'Shrrii', '+919603190571', 'aashakiranbhukya@gmail.com', '2025-03-03-67c5b0aee9c78.png', '23.603810533412425', '82.36665543168783', 'J938+GM Chandha, Chhattisgarh, India', NULL, 0.00, NULL, 0, 0, 26, '2025-03-03 19:07:50', '2025-03-03 19:07:51', 0, NULL, '2025-03-03-67c5b0aeef5df.png', 1, 1, 1, 23.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '15-20 minute', 1, 1, 0, 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'shrrii', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(29, 'Demo Store', '+919002184493', 'testseller@gmail.com', '2025-03-08-67cc30390af81.png', '23.6888636', '86.9660638', 'J938+GM Chandha, Chhattisgarh, India', NULL, 0.00, NULL, 0, 1, 29, '2025-03-04 10:27:09', '2025-03-08 17:25:37', 0, NULL, '2025-03-08-67cc30390d2a5.png', 1, 1, 1, 5.00, 2, 1, 1, ' ', '{\"status\":\"0\",\"code\":null}', 0, 0, 0.00, '17-35 min', 0, 1, 0, 2, 5, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'demo-store-2', 0.000, 0, 'Pharmacy', 'This Is A Pharmacy Store', NULL, 0, NULL, 'commission', NULL),
(31, 'Ishva Products Private Limited', '+918019280192', 'ishvaproducts@gmail.com', '2025-03-04-67c6cbf792f45.png', '17.37240998146135', '78.51871613413095', '27, Shalivahana Nagar, Teegala Guda, SBI Colony, Moosarambagh, Hyderabad, Telangana 500036, India', NULL, 0.00, NULL, 0, 1, 31, '2025-03-04 15:16:31', '2025-03-05 13:02:04', 0, NULL, '2025-03-04-67c6cbf7966e8.png', 1, 1, 1, 12.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '1-2 minute', 1, 1, 0, 0, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'ishva-products-private-limited', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(33, 'PET SHOP', '+919542400658', 'rishiofficial444@gmail.com', '2025-03-05-67c81cb6e7e52.png', '17.338444238766307', '78.61171636730433', '8JQ6+QW, Jangareddy Colony, Hyderabad, Hathiguda, Telangana 501505, India', NULL, 0.00, NULL, 0, 1, 33, '2025-03-05 15:13:18', '2025-03-05 15:14:42', 0, NULL, '2025-03-05-67c81cb6eb784.png', 1, 1, 1, 18.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '3-4 minute', 1, 1, 0, 0, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'pet-shop', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(34, 'Pizza Store', '+918121032518', 'sweethearts221067@gmail.com', '2025-03-05-67c824b6ae91a.png', '17.445685951395475', '78.38994763791561', 'Villa-11, BOLLINENI HOMES, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081, India', NULL, 0.00, NULL, 0, 1, 34, '2025-03-05 15:47:26', '2025-03-05 15:48:07', 0, NULL, '2025-03-05-67c824b6b1e16.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '15-30 minute', 1, 1, 0, 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'pizza-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(35, 'Pharma', '+91+919666888270', 'srikargoudmodem@gmail.com', '2025-03-05-67c82ada949dc.png', '23.603810533412425', '82.36665543168783', 'J938+GM Chandha, Chhattisgarh, India', NULL, 0.00, NULL, 0, 1, 35, '2025-03-05 16:13:38', '2025-03-05 16:13:56', 0, NULL, '2025-03-05-67c82ada96c4f.png', 1, 1, 1, 15.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '1-4 minute', 1, 1, 0, 0, 5, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'pharma', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(36, 'Sony Fruits', '+917993008628', 'gr14ms011@gmail.com', '2025-03-05-67c8380ca9163.png', '17.418236578799384', '78.56639575213194', '8/35/D/1, Hema Nagar, Boduppal, Hyderabad, Telangana 500092, India', NULL, 0.00, NULL, 0, 1, 36, '2025-03-05 17:09:56', '2025-03-05 17:10:27', 0, NULL, '2025-03-05-67c8380cab3f6.png', 1, 1, 1, 10.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '15-30 minute', 1, 1, 0, 0, 7, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'sony-fruits', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(38, 'Santosh', '+91+1917569797106', 'santoshramagiri143@gmail.com', '2025-03-05-67c84afb5a1ea.png', '23.603810533412425', '82.36665543168783', 'J938+GM Chandha, Chhattisgarh, India', NULL, 0.00, NULL, 0, 1, 38, '2025-03-05 18:30:43', '2025-03-05 18:30:54', 0, NULL, '2025-03-05-67c84afb5be36.png', 1, 1, 1, 45.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '3-4 minute', 1, 1, 0, 0, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'santosh', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(39, 'Grocery World', '+919001281234', 'testseller33@gmail.com', '2025-03-08-67cc317bc5c0c.png', '23.815729053772838', '86.88670501112938', 'RV8P+8MH, Rupnarayanpur, Chittaranjan, West Bengal 713364, India', NULL, 99.00, NULL, 0, 1, 39, '2025-03-08 17:30:59', '2025-03-08 17:38:11', 0, NULL, '2025-03-08-67cc317bc98d9.png', 1, 1, 1, 5.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '16-29 min', 0, 0, 0, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'grocery-world', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(40, 'Testdemo Store', '+911234567890', 'testdemo@gmail.com', '2025-03-10-67ced459b27ea.png', '23.603810533412425', '82.36665543168783', 'J938+GM Chandha, Chhattisgarh, India', NULL, 0.00, NULL, 0, 1, 40, '2025-03-10 17:30:25', '2025-03-10 17:32:49', 0, NULL, '2025-03-10-67ced459b5fd4.png', 1, 1, 1, 12.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '12-60 minute', 1, 1, 0, 0, 3, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'testdemo-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(41, 'test', '+9168886888', 'tastytawa@gmail.com', '2025-03-10-67ced77b6d183.png', '23.6888636', '86.9660638', 'rtsuhgrtdutjtjuytij', NULL, 1.00, NULL, 0, 1, 41, '2025-03-10 17:43:47', '2025-04-25 18:03:49', 0, NULL, '2025-03-10-67ced77b70d3a.png', 1, 1, 1, 12.00, 5, 1, 1, ' ', '{\"status\":\"0\",\"code\":null}', 0, 0, 0.00, '12-60 min', 1, 1, 3, 4, 3, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'test', 0.000, 1, 'Wjjw', 'Enen', NULL, 0, NULL, 'commission', NULL),
(42, 'Demooo Store', '+919002184491', 'hhhghjj929@gmail.com', '2025-04-03-67ee19b9891ec.png', '23.67890474231969', '86.97304330766201', 'MXHF+M88, Namo Para, Pathak Bari, Asansol, West Bengal 713303, India', NULL, 0.00, NULL, 0, 1, 42, '2025-04-03 10:46:41', '2025-04-03 11:06:24', 0, NULL, '2025-04-03-67ee19b98c423.png', 1, 1, 1, 5.00, 5, 1, 0, ' ', NULL, 0, 0, 0.00, '16-25 min', 1, 1, 0, 0, 7, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'demooo-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(43, 'Demo Store', '+919002181234', 'demostore33@gmail.com', '2025-04-18-68025d005f977.png', '23.685979583122965', '86.96536716073751', '81/C, Pathak Bari, Asansol, West Bengal 713302, India', NULL, 20.00, NULL, 0, 1, 43, '2025-04-18 19:39:04', '2025-04-24 12:39:14', 0, NULL, '2025-04-18-68025d0063783.png', 1, 1, 1, 5.00, 5, 1, 1, ' ', '{\"status\":\"0\",\"code\":null}', 0, 0, 0.00, '19-31 min', 0, 1, 0, 0, 1, NULL, NULL, NULL, NULL, NULL, NULL, 15, 0, 0.000, 0, 'demo-store-3', 0.000, 0, 'Dkwkmw', 'Ejjwwj', NULL, 0, NULL, 'commission', NULL),
(44, 'Demo 2', '+919429691367', 'shopzeo02@gmail.com', '2025-04-19-6803602cd7d39.png', '23.6888636', '86.9660638', 'Kolkata', NULL, 0.00, NULL, 0, 1, 44, '2025-04-19 14:04:52', '2025-04-19 14:04:52', 0, NULL, '2025-04-19-6803602cdaf88.png', 1, 1, 1, 10.00, 5, 1, 1, ' ', NULL, 0, 0, 0.00, '30-60 min', 1, 1, 0, 0, 13, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'demo-2', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(45, 'STYLE FASHION', '+91906426166', 'stylofashion135@gmail.com', '2025-04-26-680bd7f351daa.png', '23.8145545', '86.8866319', 'Rupnarayanpur, West Bengal, India', NULL, 0.00, NULL, 0, 1, 45, '2025-04-26 00:14:03', '2025-04-26 00:55:08', 0, '{\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":1}', '2025-04-26-680bd7f35508e.png', 1, 1, 1, 18.00, 6, 1, 1, ' ', NULL, 0, 0, 0.00, '15-30 min', 1, 1, 2, 2, 17, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.000, 0, 'style-fashion', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(46, 'SAM', '+919616261989', 'saurabhp4nd3y@gmail.com', '2025-05-28-68371f976af81.png', '12.910054018191076', '77.62190815061331', '5-1/8, 1st Main Rd, NGR Layout, Roopena Agrahara, Bommanahalli, Bengaluru, Karnataka 560068, India', NULL, 0.00, NULL, 0, 1, 46, '2025-05-28 20:07:11', '2025-06-21 14:30:45', 0, NULL, '2025-05-28-68371f9771c66.png', 1, 1, 1, 20646.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '15-20 minute', 1, 1, 0, 0, 4, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, 0.000, 0, 'sam', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(47, 'Test Store', '9876543210', 'seller@test.com', NULL, '28.7041', '77.1025', '123 Test Street, Delhi, India', NULL, 0.00, NULL, 0, 1, 47, '2025-08-03 11:17:39', '2025-08-08 04:13:47', 0, NULL, NULL, 1, 1, 1, 18.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '30-60', 1, 1, 0, 0, 1, 'quick_commerce', 'STORE000047', '22AAAAA0000A1Z5', 'ABCDE1234F', '123456789012', 'INV-001', 0, 1, 0.000, 0, 'test-store', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL),
(49, 'Mindmanthan pvt ltd', '+919005988152', 'info.mindmanthan@gmail.com', '2025-08-10-68979ff352e61.png', '27.3780141', '83.6397345', 'VILL SIHABHAR\r\nPOST DAGARUPUR\r\nTAHSIL NAUTANWA', NULL, 0.00, NULL, 0, 1, 49, '2025-08-09 15:36:05', '2025-08-09 20:01:44', 0, NULL, '2025-08-10-68979ff397902.png', 1, 1, 1, 18.00, 2, 1, 1, ' ', NULL, 0, 0, 0.00, '30-60 min', 1, 1, 0, 0, 8, 'quick_commerce', 'ST2025000043', '09AAACH7409R1ZZ', 'FUMPP3159L', '437023456778', 'Mind00239', 0, 1, 0.000, 0, 'mindmanthan-pvt-ltd', NULL, 0, NULL, NULL, NULL, 0, NULL, 'commission', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `restaurants_phone_unique` (`phone`),
  ADD UNIQUE KEY `stores_store_id_unique` (`store_id`),
  ADD KEY `stores_module_id_foreign` (`module_id`),
  ADD KEY `idx_stores_module_zone` (`module_id`,`zone_id`),
  ADD KEY `idx_stores_module_order_count` (`module_id`,`order_count`),
  ADD KEY `idx_stores_zone_order_count` (`zone_id`,`order_count`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stores`
--
ALTER TABLE `stores`
  ADD CONSTRAINT `stores_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
