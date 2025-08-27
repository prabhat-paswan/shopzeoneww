const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../controllers/authController');

// Public routes
router.post('/captcha', authController.generateCaptcha);
router.post('/login', authController.adminLogin);

// Protected routes
router.use(verifyToken); // Apply middleware to all routes below
router.post('/logout', authController.logout);
router.get('/profile', authController.getProfile);

module.exports = router;
