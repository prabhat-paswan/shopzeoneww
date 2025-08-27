const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationQueue = sequelize.define('NotificationQueue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional data for the notification'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'normal'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'sent', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When notification should be sent'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  retryCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxRetries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'notification_queue',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['scheduledAt']
    },
    {
      fields: ['sentAt']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = NotificationQueue;
