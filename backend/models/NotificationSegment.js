const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NotificationSegment = sequelize.define('NotificationSegment', {
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
  criteria: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Segment criteria (filters, conditions, etc.)'
  },
  userCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
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
  tableName: 'notification_segments',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['lastUpdated']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = NotificationSegment;
