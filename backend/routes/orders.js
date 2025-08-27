const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, User } = require('../models');

// Get user orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: OrderItem, include: [{ model: Product, attributes: ['name', 'price'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: OrderItem, include: [{ model: Product, attributes: ['name', 'price'] }] }
      ]
    });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
      }
      total += product.price * item.quantity;
    }
    
    const order = await Order.create({
      userId: req.user.id,
      total,
      status: 'pending',
      shippingAddress,
      paymentMethod
    });
    
    // Create order items
    for (const item of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: (await Product.findByPk(item.productId)).price
      });
    }
    
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
