const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationCampaign = sequelize.define('NotificationCampaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  templateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'notification_templates',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('email', 'sms', 'push', 'in_app'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft'
  },
  targetAudience: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Target audience criteria (roles, segments, etc.)'
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  totalRecipients: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sentCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  deliveredCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  openedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  clickedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'notification_campaigns',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['templateId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['status']
    },
    {
      fields: ['scheduledAt']
    },
    {
      fields: ['startedAt']
    },
    {
      fields: ['completedAt']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = NotificationCampaign;
