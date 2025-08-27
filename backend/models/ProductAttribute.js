const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductAttribute = sequelize.define('ProductAttribute', {
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
  attributeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'attributes',
      key: 'id'
    }
  },
  attributeValueId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'attribute_values',
      key: 'id'
    }
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Custom value for the attribute (used when attributeValueId is null)'
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isVisible: {
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
  tableName: 'product_attributes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['productId', 'attributeId']
    },
    {
      fields: ['productId']
    },
    {
      fields: ['attributeId']
    },
    {
      fields: ['attributeValueId']
    },
    {
      fields: ['isRequired']
    },
    {
      fields: ['isVisible']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = ProductAttribute;
