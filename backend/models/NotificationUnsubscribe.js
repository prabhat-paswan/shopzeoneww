const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationUnsubscribe = sequelize.define('NotificationUnsubscribe', {
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
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Category of notifications to unsubscribe from'
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Reason for unsubscribing'
  },
  unsubscribedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'notification_unsubscribes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'type', 'category']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['unsubscribedAt']
    }
  ]
});

module.exports = NotificationUnsubscribe;
