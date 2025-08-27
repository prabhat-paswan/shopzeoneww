const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationSchedule = sequelize.define('NotificationSchedule', {
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
  schedule: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Schedule configuration (cron expression, intervals, etc.)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastRun: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextRun: {
    type: DataTypes.DATE,
    allowNull: true
  },
  runCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxRuns: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum number of times to run (null = unlimited)'
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
  tableName: 'notification_schedules',
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
      fields: ['isActive']
    },
    {
      fields: ['nextRun']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = NotificationSchedule;
