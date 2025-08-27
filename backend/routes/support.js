const express = require('express');
const router = express.Router();
const { Ticket, Message, User } = require('../models');

// Get user tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['updatedAt', 'DESC']]
    });
    
    res.json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single ticket with messages
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Message, include: [{ model: User, attributes: ['name', 'email'] }] }
      ]
    });
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new ticket
router.post('/', async (req, res) => {
  try {
    const { subject, description, priority, category } = req.body;
    
    const ticket = await Ticket.create({
      userId: req.user.id,
      subject,
      description,
      priority: priority || 'medium',
      category,
      status: 'open'
    });
    
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add message to ticket
router.post('/:id/messages', async (req, res) => {
  try {
    const { content } = req.body;
    
    const message = await Message.create({
      ticketId: req.params.id,
      userId: req.user.id,
      content,
      isFromUser: true
    });
    
    // Update ticket status
    await Ticket.update(
      { status: 'waiting_for_support' },
      { where: { id: req.params.id } }
    );
    
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
