const express = require('express');
const router = express.Router();
const { Wallet, Transaction, User } = require('../models');

// Get user wallet
router.get('/', async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user.id,
        balance: 0,
        currency: 'USD'
      });
    }
    
    res.json({ success: true, data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get wallet transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add funds to wallet
router.post('/add-funds', async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    let wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user.id,
        balance: 0,
        currency: 'USD'
      });
    }
    
    await wallet.update({ balance: wallet.balance + parseFloat(amount) });
    
    await Transaction.create({
      userId: req.user.id,
      type: 'credit',
      amount: parseFloat(amount),
      description: 'Wallet top-up',
      paymentMethod
    });
    
    res.json({ success: true, message: 'Funds added successfully', data: wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
