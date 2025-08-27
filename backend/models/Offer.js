const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Offer = sequelize.define('Offer', {
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
  type: {
    type: DataTypes.ENUM('percentage', 'fixed', 'buy_one_get_one', 'free_shipping'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  applicableProducts: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of product IDs where offer applies'
  },
  applicableCategories: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of category IDs where offer applies'
  },
  applicableStores: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of store IDs where offer applies'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
  tableName: 'offers',
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isFeatured']
    },
    {
      fields: ['startDate']
    },
    {
      fields: ['endDate']
    },
    {
      fields: ['createdBy']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = Offer;
