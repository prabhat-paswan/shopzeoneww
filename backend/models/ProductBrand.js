const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductBrand = sequelize.define('ProductBrand', {
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
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'brands',
      key: 'id'
    }
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if this is the primary brand for the product'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'product_brands',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['productId', 'brandId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['brandId']
    },
    {
      fields: ['isPrimary']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = ProductBrand;
