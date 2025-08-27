const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationPreference = sequelize.define('NotificationPreference', {
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
    allowNull: false,
    defaultValue: 'general'
  },
  isEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  frequency: {
    type: DataTypes.ENUM('immediate', 'daily', 'weekly', 'monthly'),
    allowNull: false,
    defaultValue: 'immediate'
  },
  quietHours: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Quiet hours configuration: {start: "22:00", end: "08:00"}'
  },
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'UTC'
  }
}, {
  tableName: 'notification_preferences',
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
      fields: ['isEnabled']
    }
  ]
});

module.exports = NotificationPreference;
