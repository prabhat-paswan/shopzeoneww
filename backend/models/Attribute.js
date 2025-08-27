const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attribute = sequelize.define('Attribute', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('text', 'number', 'select', 'multiselect', 'boolean', 'date'),
    allowNull: false,
    defaultValue: 'text'
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isUnique: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isFilterable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isSearchable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isComparable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isVisibleOnFrontend: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isSystem: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'attributes',
  timestamps: true
});

module.exports = Attribute;
