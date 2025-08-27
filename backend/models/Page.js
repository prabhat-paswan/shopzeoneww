const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pageType: {
    type: DataTypes.ENUM('about', 'contact', 'privacy', 'terms', 'faq', 'help', 'custom'),
    allowNull: false,
    defaultValue: 'custom'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  requiresAuth: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  featuredImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  metaTitle: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.STRING(160),
    allowNull: true
  },
  metaKeywords: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'pages',
  timestamps: true,
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['pageType']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isPublic']
    },
    {
      fields: ['requiresAuth']
    },
    {
      fields: ['publishedAt']
    },
    {
      fields: ['createdBy']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = Page;
