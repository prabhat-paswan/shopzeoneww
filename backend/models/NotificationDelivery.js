const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationDelivery = sequelize.define('NotificationDelivery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notificationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'notifications',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  channelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'notification_channels',
      key: 'id'
    }
  },
  providerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'notification_providers',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed', 'bounced', 'spam'),
    allowNull: false,
    defaultValue: 'pending'
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failureReason: {
    type: DataTypes.TEXT,
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
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional delivery metadata'
  }
}, {
  tableName: 'notification_deliveries',
  timestamps: true,
  indexes: [
    {
      fields: ['notificationId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['channelId']
    },
    {
      fields: ['providerId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['sentAt']
    },
    {
      fields: ['deliveredAt']
    }
  ]
});

module.exports = NotificationDelivery;
