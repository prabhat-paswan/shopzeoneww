const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Brand name in English'
  },
  name_ar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Brand name in Arabic'
  },
  name_bn: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Brand name in Bangla'
  },
  name_hi: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Brand name in Hindi'
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'URL-friendly brand identifier'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brand description in English'
  },
  description_ar: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brand description in Arabic'
  },
  description_bn: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brand description in Bangla'
  },
  description_hi: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brand description in Hindi'
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Brand logo image path'
  },
  banner: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Brand banner image path'
  },
  image_alt_text: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Alt text for brand images'
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Brand official website'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Brand contact email'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Brand contact phone'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brand address'
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Brand country of origin'
  },
  founded_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Year brand was founded'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether brand is featured'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Brand status'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Sort order for display'
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
  },
  total_products: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total products under this brand'
  },
  total_sales: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Total sales for this brand'
  }
}, {
  tableName: 'brands',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['name']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['is_featured']
    },
    {
      fields: ['sort_order']
    },
    {
      fields: ['country']
    }
  ]
});

module.exports = Brand;
