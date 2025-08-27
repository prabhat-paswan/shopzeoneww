const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationProvider = sequelize.define('NotificationProvider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('email', 'sms', 'push', 'webhook'),
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Provider name (e.g., SendGrid, Twilio, Firebase)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  config: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Provider configuration (API keys, endpoints, etc.)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Priority order for provider selection'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'notification_providers',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['type']
    },
    {
      fields: ['provider']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = NotificationProvider;
