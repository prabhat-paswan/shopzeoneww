const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShippingZone = sequelize.define('ShippingZone', {
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
  countries: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of country codes in this zone'
  },
  states: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of state/province codes in this zone'
  },
  cities: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of city names in this zone'
  },
  postalCodes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of postal code patterns in this zone'
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
  tableName: 'shipping_zones',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = ShippingZone;
