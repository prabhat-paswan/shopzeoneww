const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductCategory = sequelize.define('ProductCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if this is the primary category for the product'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'product_categories',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['productId', 'categoryId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['categoryId']
    },
    {
      fields: ['isPrimary']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = ProductCategory;
