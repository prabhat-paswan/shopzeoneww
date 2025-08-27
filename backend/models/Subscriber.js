const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscriber = sequelize.define('Subscriber', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  source: {
    type: DataTypes.ENUM('website', 'checkout', 'import', 'api'),
    allowNull: false,
    defaultValue: 'website'
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Newsletter preferences and categories'
  },
  lastEmailSent: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emailCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  openCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  clickCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  unsubscribeReason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'subscribers',
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isVerified']
    },
    {
      fields: ['source']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Subscriber;
