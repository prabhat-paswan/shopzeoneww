const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  paymentNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  method: {
    type: DataTypes.ENUM('stripe', 'paypal', 'razorpay', 'cod', 'bank_transfer', 'wallet', 'other'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  gatewayTransactionId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Transaction ID from payment gateway'
  },
  gatewayResponse: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Response from payment gateway'
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  hooks: {
    beforeCreate: (payment) => {
      if (!payment.paymentNumber) {
        payment.paymentNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      }
    }
  },
  indexes: [
    {
      fields: ['paymentNumber']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['method']
    },
    {
      fields: ['status']
    },
    {
      fields: ['gatewayTransactionId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Payment;
