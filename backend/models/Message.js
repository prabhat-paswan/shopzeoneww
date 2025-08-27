const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  threadId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'message_threads',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  senderType: {
    type: DataTypes.ENUM('customer', 'vendor', 'admin', 'support'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file', 'system'),
    allowNull: false,
    defaultValue: 'text'
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of attachment URLs'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isInternal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if message is internal note (not visible to customer)'
  }
}, {
  tableName: 'messages',
  timestamps: true,
  indexes: [
    {
      fields: ['threadId']
    },
    {
      fields: ['senderId']
    },
    {
      fields: ['senderType']
    },
    {
      fields: ['isRead']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Message;
