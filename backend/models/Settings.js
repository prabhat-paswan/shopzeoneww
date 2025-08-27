const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Setting key/identifier'
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Setting value (can be JSON string)'
  },
  type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'file', 'select'),
    allowNull: false,
    defaultValue: 'string'
  },
  category: {
    type: DataTypes.ENUM('general', 'business', 'email', 'sms', 'payment', 'shipping', 'tax', 'seo', 'social', 'security', 'other'),
    allowNull: false,
    defaultValue: 'general'
  },
  group: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Group for organizing related settings'
  },
  label: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Human-readable label for the setting'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of what the setting controls'
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if setting is required'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if setting can be viewed publicly'
  },
  isEditable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'True if setting can be edited'
  },
  validation: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Validation rules for the setting'
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Available options for select-type settings'
  },
  defaultValue: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Default value for the setting'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'settings',
  timestamps: true,
  indexes: [
    {
      fields: ['key']
    },
    {
      fields: ['category']
    },
    {
      fields: ['group']
    },
    {
      fields: ['isPublic']
    },
    {
      fields: ['isEditable']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = Settings;
