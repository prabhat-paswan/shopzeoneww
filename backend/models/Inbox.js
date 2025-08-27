const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inbox = sequelize.define('Inbox', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('general', 'support', 'sales', 'partnership', 'feedback', 'complaint', 'other'),
    allowNull: false,
    defaultValue: 'general'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'normal'
  },
  status: {
    type: DataTypes.ENUM('new', 'read', 'replied', 'closed', 'spam'),
    allowNull: false,
    defaultValue: 'new'
  },
  source: {
    type: DataTypes.ENUM('contact_form', 'email', 'phone', 'chat', 'social_media', 'other'),
    allowNull: false,
    defaultValue: 'contact_form'
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    comment: 'IPv4 or IPv6 address'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Geographic location data'
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  readBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  repliedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  repliedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  closedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  closeReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of tags for categorization'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes for staff'
  },
  isSpam: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  spamScore: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    comment: 'Spam detection score (0.00 to 1.00)'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional metadata'
  }
}, {
  tableName: 'inbox',
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['category']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['status']
    },
    {
      fields: ['source']
    },
    {
      fields: ['assignedTo']
    },
    {
      fields: ['isSpam']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Inbox;
