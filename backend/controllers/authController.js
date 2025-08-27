const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const { generateCaptcha, validateCaptcha } = require('../utils/captcha');

// Store captcha sessions (in production, use Redis)
const captchaSessions = new Map();

// Generate Captcha
exports.generateCaptcha = async (req, res) => {
  try {
    const sessionId = req.sessionID || Date.now().toString();
    const captcha = generateCaptcha();
    
    // Store captcha in session
    captchaSessions.set(sessionId, {
      text: captcha.text,
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
    });

    res.json({
      success: true,
      data: {
        sessionId,
        image: captcha.image,
        expiresIn: 300 // 5 minutes in seconds
      }
    });
  } catch (error) {
    console.error('Captcha generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate captcha'
    });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password, captchaText, sessionId } = req.body;

    // Validate required fields
    if (!email || !password || !captchaText || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate captcha
    const captchaSession = captchaSessions.get(sessionId);
    if (!captchaSession || Date.now() > captchaSession.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Captcha expired or invalid session'
      });
    }

    if (captchaSession.text.toLowerCase() !== captchaText.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid captcha code'
      });
    }

    // Clear used captcha
    captchaSessions.delete(sessionId);

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed attempts'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      admin.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 15 minutes
      if (admin.loginAttempts >= 5) {
        admin.lockedUntil = new Date(Date.now() + (15 * 60 * 1000)); // 15 minutes
      }
      
      await admin.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET || 'shopzeo-secret-key',
      { expiresIn: '24h' }
    );

    // Set token in cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify Token Middleware
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shopzeo-secret-key');
    
    // Check if admin still exists and is active
    const admin = await Admin.findByPk(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or deactivated account'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('adminToken');
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

// Get Current Admin Profile
exports.getProfile = async (req, res) => {
  try {
    const admin = req.admin;
    res.json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
