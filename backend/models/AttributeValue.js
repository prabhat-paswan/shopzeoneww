const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AttributeValue = sequelize.define('AttributeValue', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  attributeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'attributes',
      key: 'id'
    }
  },
  value: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'attribute_values',
  timestamps: true
});

module.exports = AttributeValue;
