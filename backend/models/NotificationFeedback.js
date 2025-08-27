const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationFeedback = sequelize.define('NotificationFeedback', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notificationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'notifications',
      key: 'id'
    }
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'User rating of the notification (1-5)'
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'User feedback about the notification'
  },
  isHelpful: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: 'Whether the notification was helpful'
  },
  submittedAt: {
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
  tableName: 'notification_feedback',
  timestamps: true,
  indexes: [
    {
      fields: ['notificationId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['isHelpful']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['submittedAt']
    }
  ]
});

module.exports = NotificationFeedback;
