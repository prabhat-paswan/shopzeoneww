const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PayoutRequest = sequelize.define('PayoutRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
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
  paymentMethod: {
    type: DataTypes.ENUM('bank_transfer', 'paypal', 'stripe', 'check', 'other'),
    allowNull: false
  },
  paymentDetails: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Payment method specific details'
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes for admin use'
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  processedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'payout_requests',
  timestamps: true,
  hooks: {
    beforeCreate: (request) => {
      if (!request.requestNumber) {
        request.requestNumber = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      }
    }
  },
  indexes: [
    {
      fields: ['requestNumber']
    },
    {
      fields: ['vendorId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentMethod']
    },
    {
      fields: ['processedBy']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = PayoutRequest;
