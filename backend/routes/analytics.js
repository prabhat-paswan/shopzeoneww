const express = require('express');
const { Op } = require('sequelize');
const moment = require('moment');

const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { requireAdmin } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Get dashboard overview statistics
router.get('/dashboard-overview', requireAdmin, asyncHandler(async (req, res) => {
  const now = moment();
  const startOfYear = moment().startOf('year');
  const startOfMonth = moment().startOf('month');
  const startOfWeek = moment().startOf('week');

  // Get user counts by role
  const userStats = await User.findAll({
    attributes: [
      'role',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    where: { isDeleted: false },
    group: ['role']
  });

  // Get order statistics
  const orderStats = await Order.findAll({
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    where: { isDeleted: false },
    group: ['status']
  });

  // Get total products and stores
  const totalProducts = await Product.count({ where: { isDeleted: false } });
  const totalStores = await Store.count({ where: { isDeleted: false } });

  // Get revenue statistics for different time periods
  const yearlyRevenue = await Order.sum('totalAmount', {
    where: {
      createdAt: { [Op.gte]: startOfYear.toDate() },
      paymentStatus: 'paid',
      isDeleted: false
    }
  });

  const monthlyRevenue = await Order.sum('totalAmount', {
    where: {
      createdAt: { [Op.gte]: startOfMonth.toDate() },
      paymentStatus: 'paid',
      isDeleted: false
    }
  });

  const weeklyRevenue = await Order.sum('totalAmount', {
    where: {
      createdAt: { [Op.gte]: startOfWeek.toDate() },
      paymentStatus: 'paid',
      isDeleted: false
    }
  });

  // Format user statistics
  const userOverview = {
    total: 0,
    customers: 0,
    vendors: 0,
    deliveryMen: 0,
    employees: 0
  };

  userStats.forEach(stat => {
    const count = parseInt(stat.get('count'));
    userOverview.total += count;
    userOverview[stat.role + 's'] = count;
  });

  // Format order statistics
  const orderOverview = {
    total: 0,
    pending: 0,
    confirmed: 0,
    packaging: 0,
    out_for_delivery: 0,
    delivered: 0,
    returned: 0,
    failed: 0,
    cancelled: 0
  };

  orderStats.forEach(stat => {
    const count = parseInt(stat.get('count'));
    orderOverview.total += count;
    orderOverview[stat.status] = count;
  });

  res.json({
    success: true,
    data: {
      userOverview,
      orderOverview,
      totalProducts,
      totalStores,
      revenue: {
        yearly: yearlyRevenue || 0,
        monthly: monthlyRevenue || 0,
        weekly: weeklyRevenue || 0
      }
    }
  });
}));

// Get order statistics with time filters
router.get('/order-statistics', requireAdmin, asyncHandler(async (req, res) => {
  const { period = 'year' } = req.query;
  
  let startDate, endDate;
  const now = moment();

  switch (period) {
    case 'week':
      startDate = now.clone().startOf('week');
      endDate = now.clone().endOf('week');
      break;
    case 'month':
      startDate = now.clone().startOf('month');
      endDate = now.clone().endOf('month');
      break;
    case 'year':
    default:
      startDate = now.clone().startOf('year');
      endDate = now.clone().endOf('year');
      break;
  }

  // Get order statistics grouped by date
  const orderStats = await Order.findAll({
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'orders'],
      [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'revenue']
    ],
    where: {
      createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
      isDeleted: false
    },
    group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
  });

  // Get order type breakdown
  const orderTypeStats = await Order.findAll({
    attributes: [
      'orderType',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'revenue']
    ],
    where: {
      createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
      isDeleted: false
    },
    group: ['orderType']
  });

  res.json({
    success: true,
    data: {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      dailyStats: orderStats,
      orderTypeBreakdown: orderTypeStats
    }
  });
}));

// Get earning statistics
router.get('/earning-statistics', requireAdmin, asyncHandler(async (req, res) => {
  const { period = 'year' } = req.query;
  
  let startDate, endDate;
  const now = moment();

  switch (period) {
    case 'week':
      startDate = now.clone().startOf('week');
      endDate = now.clone().endOf('week');
      break;
    case 'month':
      startDate = now.clone().startOf('month');
      endDate = now.clone().endOf('month');
      break;
    case 'year':
    default:
      startDate = now.clone().startOf('year');
      endDate = now.clone().endOf('year');
      break;
  }

  // Get revenue breakdown by order type
  const revenueStats = await Order.findAll({
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
      [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'totalRevenue'],
      [require('sequelize').fn('SUM', require('sequelize').col('commissionAmount')), 'commissionEarned'],
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'orders']
    ],
    where: {
      createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
      paymentStatus: 'paid',
      isDeleted: false
    },
    group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
  });

  // Calculate totals
  const totals = revenueStats.reduce((acc, stat) => {
    acc.totalRevenue += parseFloat(stat.get('totalRevenue') || 0);
    acc.commissionEarned += parseFloat(stat.get('commissionEarned') || 0);
    acc.orders += parseInt(stat.get('orders') || 0);
    return acc;
  }, { totalRevenue: 0, commissionEarned: 0, orders: 0 });

  res.json({
    success: true,
    data: {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      dailyStats: revenueStats,
      totals
    }
  });
}));

// Get top customers
router.get('/top-customers', requireAdmin, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const topCustomers = await Order.findAll({
    attributes: [
      'customerId',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'orderCount'],
      [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'totalSpent']
    ],
    include: [{
      model: User,
      as: 'customer',
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      where: { role: 'customer', isDeleted: false }
    }],
    where: { isDeleted: false },
    group: ['customerId'],
    order: [[require('sequelize').literal('orderCount'), 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: topCustomers
  });
}));

// Get top selling stores
router.get('/top-selling-stores', requireAdmin, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const topStores = await Order.findAll({
    attributes: [
      'storeId',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'orderCount'],
      [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'totalRevenue']
    ],
    include: [{
      model: Store,
      as: 'store',
      attributes: ['id', 'name', 'logo', 'rating', 'totalRatings'],
      where: { isDeleted: false }
    }],
    where: { isDeleted: false },
    group: ['storeId'],
    order: [[require('sequelize').literal('totalRevenue'), 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: topStores
  });
}));

// Get top selling products
router.get('/top-selling-products', requireAdmin, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const topProducts = await Product.findAll({
    attributes: [
      'id',
      'name',
      'slug',
      'price',
      'rating',
      'totalRatings',
      'totalSales',
      'images'
    ],
    where: { 
      status: 'active',
      isDeleted: false 
    },
    order: [['totalSales', 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: topProducts
  });
}));

// Get most popular products
router.get('/popular-products', requireAdmin, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const popularProducts = await Product.findAll({
    attributes: [
      'id',
      'name',
      'slug',
      'price',
      'rating',
      'totalRatings',
      'totalViews',
      'images'
    ],
    where: { 
      status: 'active',
      isDeleted: false 
    },
    order: [['totalViews', 'DESC'], ['rating', 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: popularProducts
  });
}));

// Get top delivery men
router.get('/top-delivery-men', requireAdmin, asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const topDeliveryMen = await Order.findAll({
    attributes: [
      'deliveryManId',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'deliveryCount']
    ],
    include: [{
      model: User,
      as: 'deliveryMan',
      attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      where: { role: 'delivery_man', isDeleted: false }
    }],
    where: { 
      deliveryManId: { [Op.ne]: null },
      isDeleted: false 
    },
    group: ['deliveryManId'],
    order: [[require('sequelize').literal('deliveryCount'), 'DESC']],
    limit: parseInt(limit)
  });

  res.json({
    success: true,
    data: topDeliveryMen
  });
}));

// Get sales analytics by category
router.get('/sales-by-category', requireAdmin, asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;
  
  let startDate, endDate;
  const now = moment();

  switch (period) {
    case 'week':
      startDate = now.clone().startOf('week');
      endDate = now.clone().endOf('week');
      break;
    case 'month':
      startDate = now.clone().startOf('month');
      endDate = now.clone().endOf('month');
      break;
    case 'year':
    default:
      startDate = now.clone().startOf('year');
      endDate = now.clone().endOf('year');
      break;
  }

  // This would require a join with categories table
  // For now, returning a placeholder structure
  res.json({
    success: true,
    data: {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      categories: []
    }
  });
}));

// Get user growth analytics
router.get('/user-growth', requireAdmin, asyncHandler(async (req, res) => {
  const { period = 'year' } = req.query;
  
  let startDate, endDate;
  const now = moment();

  switch (period) {
    case 'week':
      startDate = now.clone().startOf('week');
      endDate = now.clone().endOf('week');
      break;
    case 'month':
      startDate = now.clone().startOf('month');
      endDate = now.clone().endOf('month');
      break;
    case 'year':
    default:
      startDate = now.clone().startOf('year');
      endDate = now.clone().endOf('year');
      break;
  }

  const userGrowth = await User.findAll({
    attributes: [
      [require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'date'],
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'newUsers']
    ],
    where: {
      createdAt: { [Op.between]: [startDate.toDate(), endDate.toDate()] },
      isDeleted: false
    },
    group: [require('sequelize').fn('DATE', require('sequelize').col('createdAt'))],
    order: [[require('sequelize').fn('DATE', require('sequelize').col('createdAt')), 'ASC']]
  });

  res.json({
    success: true,
    data: {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userGrowth
    }
  });
}));

module.exports = router;
