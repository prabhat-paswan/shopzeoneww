const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationRule = sequelize.define('NotificationRule', {
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
    comment: 'Event that triggers the rule'
  },
  conditions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Conditions that must be met to execute the rule'
  },
  actions: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Actions to take when rule is triggered'
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Priority order for rule execution'
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
  tableName: 'notification_rules',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['event']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = NotificationRule;
