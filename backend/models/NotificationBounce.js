const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationBounce = sequelize.define('NotificationBounce', {
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
    comment: 'Reason for the bounce'
  },
  bounceType: {
    type: DataTypes.ENUM('hard', 'soft', 'blocked', 'spam'),
    allowNull: false,
    defaultValue: 'soft'
  },
  bouncedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'notification_bounces',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['bounceType']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['bouncedAt']
    }
  ]
});

module.exports = NotificationBounce;
