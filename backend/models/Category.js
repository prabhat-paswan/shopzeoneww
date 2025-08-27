const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
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
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Category description'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Category image path'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Parent category ID for subcategories'
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Category level (1=main, 2=sub, 3=sub-sub)'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Display priority order'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Category status'
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
  tableName: 'categories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['parent_id']
    },
    {
      fields: ['level']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['sort_order']
    }
  ]
});

module.exports = Category;
