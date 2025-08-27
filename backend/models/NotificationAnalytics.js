const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationAnalytics = sequelize.define('NotificationAnalytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
    allowNull: false
  },
  totalSent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalDelivered: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalOpened: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalClicked: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalBounced: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalSpam: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalUnsubscribed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  deliveryRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Delivery rate percentage'
  },
  openRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Open rate percentage'
  },
  clickRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Click rate percentage'
  },
  bounceRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Bounce rate percentage'
  },
  spamRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Spam rate percentage'
  },
  unsubscribeRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Unsubscribe rate percentage'
  }
}, {
  tableName: 'notification_analytics',
  timestamps: true,
  indexes: [
    {
      fields: ['date']
    },
    {
      fields: ['type']
    },
    {
      unique: true,
      fields: ['date', 'type']
    }
  ]
});

module.exports = NotificationAnalytics;
