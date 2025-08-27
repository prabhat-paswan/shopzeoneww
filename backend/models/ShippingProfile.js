const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShippingProfile = sequelize.define('ShippingProfile', {
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
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'shipping_zones',
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'stores',
      key: 'id'
    }
  },
  isGlobal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if this profile applies to all stores'
  },
  baseRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  freeShippingThreshold: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Order amount above which shipping is free'
  },
  maxShippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Maximum shipping cost for this profile'
  },
  weightBasedRates: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Weight-based shipping rates'
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
  tableName: 'shipping_profiles',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['zoneId']
    },
    {
      fields: ['storeId']
    },
    {
      fields: ['isGlobal']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = ShippingProfile;
