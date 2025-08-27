const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductMedia = sequelize.define('ProductMedia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  media_type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
    defaultValue: 'image'
  },
  media_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  media_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'product_media',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['product_id'] },
    { fields: ['media_type'] },
    { fields: ['media_order'] }
  ]
});

module.exports = ProductMedia;
