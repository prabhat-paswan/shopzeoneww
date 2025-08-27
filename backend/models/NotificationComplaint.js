const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationComplaint = sequelize.define('NotificationComplaint', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Reason for the complaint'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed description of the complaint'
  },
  reportedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resolvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes about how the complaint was resolved'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'notification_complaints',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['isResolved']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['reportedAt']
    },
    {
      fields: ['resolvedAt']
    }
  ]
});

module.exports = NotificationComplaint;
