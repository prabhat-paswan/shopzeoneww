import { useState } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import CategorySetup from './pages/admin/CategorySetup';
import SubCategorySetup from './pages/admin/SubCategorySetup';
import StoreSetup from './pages/admin/StoreSetup';
import AdminDashboard from './pages/admin/AdminDashboard';
import BrandSetup from './pages/admin/BrandSetup';
import BannerSetup from './pages/admin/BannerSetup';
import Products from './pages/admin/Products';
import BulkImport from './pages/admin/BulkImport';
import AdminLogin from './pages/admin/Login.tsx';
import { Badge } from './components/ui/badge';
import { Package, Folder, FolderOpen, Store, Tag, Image, ChevronDown, Upload } from 'lucide-react';

// Admin Layout Component with Sidebar
const AdminLayout = () => {
  const [expandedSections, setExpandedSections] = useState({
    orders: true,
    products: false,
    users: false,
    brands: false,
    inHouseProducts: false,
    vendorProducts: false,
    product: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-blue-800 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-900 font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">Shopzeo</span>
          </div>
          <button className="text-white hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Search Menu */}
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu"
              className="w-full px-3 py-2 bg-blue-800 text-white placeholder-gray-300 rounded-lg text-sm"
            />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Navigation Menu with Scrollbar */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          {/* Dashboard */}
          <div className="py-2">
            <a href="/admin" className="flex items-center space-x-3 px-3 py-2 bg-blue-800 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span>Dashboard</span>
            </a>
          </div>

          {/* POS */}
          <div className="py-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>POS</span>
            </a>
          </div>

          {/* Order Management */}
          <div className="py-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">ORDER MANAGEMENT</div>
            <div className="space-y-1">
              <button 
                onClick={() => toggleSection('orders')}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Orders</span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform ${expandedSections.orders ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Order Status Dropdown Items */}
              {expandedSections.orders && (
                <div className="ml-8 space-y-1">
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>All</span>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">191</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Pending</span>
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">58</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Confirmed</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">21</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Packaging</span>
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">9</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Out for delivery</span>
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">8</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Delivered</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">77</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Returned</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">4</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Failed to Deliver</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">5</span>
                  </a>
                  <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                    <span>Canceled</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">9</span>
                  </a>
                </div>
              )}
            </div>
            
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg mt-2">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refund Requests</span>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Product Management Section */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('product')}
              className="flex items-center justify-between w-full text-left text-white hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-3" />
                <span>Product Management</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.product ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedSections.product && (
              <div className="ml-8 mt-2 space-y-2">
                <Link
                  to="/admin/categories"
                  className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Folder className="w-4 h-4 mr-3" />
                  Category Setup
                </Link>
                <Link
                  to="/admin/subcategories"
                  className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FolderOpen className="w-4 h-4 mr-3" />
                  Sub Category Setup
                </Link>
                <Link
                  to="/admin/stores"
                  className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Store className="w-4 h-4 mr-3" />
                  Store Management
                </Link>
                <Link
                  to="/admin/brands"
                  className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Tag className="w-4 h-4 mr-3" />
                  Brand Management
                </Link>
                <Link
                  to="/admin/banners"
                  className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Image className="w-4 h-4 mr-3" />
                  Banner Management
                </Link>
                <Link
                  to="/admin/products"
                  className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Products
                </Link>
                {/* <Link
                  to="/admin/bulk-import"
                  className="flex items-center text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4 mr-3" />
                  Bulk Import
                </Link> */}
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="py-2">
            <button 
              onClick={() => toggleSection('brands')}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Brands</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.brands ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.brands && (
              <div className="ml-8 space-y-1">
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Add new</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>List</span>
                </a>
              </div>
            )}
          </div>

          {/* Product Attribute Setup */}
          <div className="py-2">
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Product Attribute Setup</span>
              </div>
            </a>
          </div>

          {/* In House Products */}
          <div className="py-2">
            <button 
              onClick={() => toggleSection('inHouseProducts')}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>In House Products</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.inHouseProducts ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.inHouseProducts && (
              <div className="ml-8 space-y-1">
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Add new</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>List</span>
                </a>
              </div>
            )}
          </div>

          {/* Vendor Products */}
          <div className="py-2">
            <button 
              onClick={() => toggleSection('vendorProducts')}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg bg-blue-800"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Vendor Products</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.vendorProducts ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.vendorProducts && (
              <div className="ml-8 space-y-1">
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>New Products Review</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">36</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Product Update Requests</span>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">0</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Approved Products</span>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">172</span>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Denied Products</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">10</span>
                </a>
              </div>
            )}
          </div>

          {/* User Management */}
          <div className="py-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">USER MANAGEMENT</div>
            <button 
              onClick={() => toggleSection('users')}
              className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>Customers</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${expandedSections.users ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.users && (
              <div className="ml-8 space-y-1">
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Vendors</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Delivery Men</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <a href="#" className="flex items-center justify-between px-3 py-1 text-sm text-gray-300 hover:bg-blue-800 rounded">
                  <span>Employees</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Promotion Management */}
          <div className="py-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">PROMOTION MANAGEMENT</div>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4a4 4 0 014-4h6a4 4 0 014 4" />
                </svg>
                <span>Banner Setup</span>
              </div>
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M9 11h.01M12 11h.01M15 11h.01M9 7h.01M12 7h.01M15 7h.01M9 4h.01M12 4h.01M15 4h.01" />
                </svg>
                <span>Offers & Deals</span>
              </div>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Help & Support */}
          <div className="py-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">HELP & SUPPORT</div>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>Inbox</span>
              <Badge variant="secondary" className="bg-red-600 text-white">12</Badge>
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>Messages</span>
              <Badge variant="secondary" className="bg-blue-600 text-white">5</Badge>
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>Support Ticket</span>
              <Badge variant="secondary" className="bg-yellow-600 text-white">8</Badge>
            </a>
          </div>

          {/* Communities */}
          <div className="py-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">COMMUNITIES</div>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>Blog Management</span>
              <Badge variant="secondary" className="bg-green-600 text-white">New</Badge>
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>News & Updates</span>
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>Customer Reviews</span>
              <Badge variant="secondary" className="bg-purple-600 text-white">25</Badge>
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>Social Media</span>
            </a>
            <a href="#" className="flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-blue-800 rounded-lg">
              <span>Community Forum</span>
              <Badge variant="secondary" className="bg-indigo-600 text-white">15</Badge>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopzeo</h1>
            <p className="text-xl text-gray-600">Welcome to your eCommerce platform!</p>
            <div className="mt-8 space-y-4">
              <a href="/auth/login" className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Login
              </a>
              <a href="/admin" className="block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Admin Dashboard
              </a>
            </div>
          </div>
        </div>
      } />
      
      {/* Admin Login Route */}
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<CategorySetup />} />
        <Route path="subcategories" element={<SubCategorySetup />} />
        <Route path="stores" element={<StoreSetup />} />
        <Route path="products" element={<Products />} />
        <Route path="brands" element={<BrandSetup />} />
        <Route path="banners" element={<BannerSetup />} />
        <Route path="bulk-import" element={<BulkImport />} />
      </Route>
      
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default AppRoutes;
