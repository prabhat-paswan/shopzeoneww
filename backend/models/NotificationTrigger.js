const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationTrigger = sequelize.define('NotificationTrigger', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  event: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Event that triggers the notification'
  },
  entityType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Type of entity that triggers the event'
  },
  conditions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Conditions that must be met to trigger notification'
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'notification_templates',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  tableName: 'notification_triggers',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['event']
    },
    {
      fields: ['entityType']
    },
    {
      fields: ['templateId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = NotificationTrigger;
