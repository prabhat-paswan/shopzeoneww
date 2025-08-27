const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Banner title'
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Banner subtitle'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Banner description'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
    comment: 'Banner image path'
  },
  image_alt_text: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Alt text for banner image'
  },
  banner_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Type of banner (main_banner, category_banner, product_banner)'
  },
  resource_type: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Type of resource (category, product, store)'
  },
  resource_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of the resource'
  },
  resource_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL of the resource'
  },
  button_text: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Text for the call-to-action button'
  },
  button_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL for the call-to-action button'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Start date for banner display'
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'End date for banner display'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether banner is active'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether banner is featured'
  },
  sort_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Sort order for banner display'
  },
  clicks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of clicks on banner'
  },
  impressions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of banner impressions'
  },
  ctr: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Click-through rate'
  },
  target_audience: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Target audience for banner'
  },
  display_conditions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Conditions for banner display'
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Meta title for SEO'
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Meta description for SEO'
  },
  meta_keywords: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Meta keywords for SEO'
  }
}, {
  tableName: 'banners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Banner;
