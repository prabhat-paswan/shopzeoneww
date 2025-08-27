const express = require('express');
const router = express.Router();
const { Payment, Order, User } = require('../models');

// Get user payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      include: [{ model: Order, attributes: ['id', 'total', 'status'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single payment
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Order, attributes: ['id', 'total', 'status'] }]
    });
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Process payment
router.post('/process', async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentDetails } = req.body;
    
    const order = await Order.findOne({
      where: { id: orderId, userId: req.user.id }
    });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Order cannot be paid' });
    }
    
    // Create payment record
    const payment = await Payment.create({
      userId: req.user.id,
      orderId: order.id,
      amount: order.total,
      paymentMethod,
      paymentDetails,
      status: 'processing'
    });
    
    // Update order status
    await order.update({ status: 'paid' });
    
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
