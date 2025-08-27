const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Webhook = sequelize.define('Webhook', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  events: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of events to trigger this webhook'
  },
  secret: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Secret key for webhook signature verification'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  lastTriggered: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastResponse: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Last response from webhook endpoint'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'webhooks',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['url']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['createdBy']
    },
    {
      fields: ['lastTriggered']
    }
  ]
});

module.exports = Webhook;
