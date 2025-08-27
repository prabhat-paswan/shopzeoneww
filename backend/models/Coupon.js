const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed', 'free_shipping'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Maximum discount amount for percentage coupons'
  },
  minOrderAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  maxUses: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum number of times coupon can be used'
  },
  usedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  maxUsesPerUser: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum uses per individual user'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isFirstTimeOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isNewCustomerOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  applicableCategories: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of category IDs where coupon applies'
  },
  applicableProducts: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of product IDs where coupon applies'
  },
  excludedCategories: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of category IDs where coupon does not apply'
  },
  excludedProducts: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of product IDs where coupon does not apply'
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
  tableName: 'coupons',
  timestamps: true,
  indexes: [
    {
      fields: ['code']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['startDate']
    },
    {
      fields: ['endDate']
    },
    {
      fields: ['type']
    },
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = Coupon;
