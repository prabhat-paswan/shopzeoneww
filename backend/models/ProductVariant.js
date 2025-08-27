const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  comparePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object with length, width, height'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'product_variants',
  timestamps: true,
  hooks: {
    beforeCreate: (variant) => {
      if (!variant.sku) {
        variant.sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
    }
  }
});

module.exports = ProductVariant;
