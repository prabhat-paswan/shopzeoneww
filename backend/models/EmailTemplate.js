const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmailTemplate = sequelize.define('EmailTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  variables: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Available variables for this template'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'general'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'email_templates',
  timestamps: true,
  indexes: [
    {
      fields: ['code']
    },
    {
      fields: ['name']
    },
    {
      fields: ['category']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = EmailTemplate;
