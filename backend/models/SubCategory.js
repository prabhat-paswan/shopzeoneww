const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SubCategory = sequelize.define('SubCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: 'Sub category name in English'
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    },
    comment: 'URL-friendly sub category name'
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Display priority order'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Sub category status'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    },
    comment: 'Parent category ID'
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'SEO meta title'
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'SEO meta description'
  },
  meta_keywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'SEO meta keywords'
  }
}, {
  tableName: 'sub_categories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_sub_categories_category_id',
      fields: ['category_id']
    },
    {
      name: 'idx_sub_categories_is_active',
      fields: ['is_active']
    },
    {
      name: 'idx_sub_categories_priority',
      fields: ['priority']
    }
  ]
});

module.exports = SubCategory;
