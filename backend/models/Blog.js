const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define('Blog', {
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
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  featuredImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  authorId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of tag strings'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isSticky: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  allowComments: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  likeCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  commentCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  shareCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  readingTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Estimated reading time in minutes'
  },
  seoTitle: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  seoDescription: {
    type: DataTypes.STRING(160),
    allowNull: true
  },
  seoKeywords: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  seoImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  schemaMarkup: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Structured data for SEO'
  }
}, {
  tableName: 'blogs',
  timestamps: true,
  hooks: {
    beforeCreate: (blog) => {
      if (!blog.slug) {
        blog.slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (blog.status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    },
    beforeUpdate: (blog) => {
      if (blog.changed('title') && !blog.changed('slug')) {
        blog.slug = blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (blog.changed('status') && blog.status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }
  },
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['authorId']
    },
    {
      fields: ['categoryId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isFeatured']
    },
    {
      fields: ['publishedAt']
    }
  ]
});

module.exports = Blog;
