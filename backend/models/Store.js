const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  logo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  banner: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'India'
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      len: [10, 20]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  gst_number: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
    validate: {
      len: [15, 15]
    }
  },
  gst_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 18.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  pan_number: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      len: [10, 10]
    }
  },
  business_type: {
    type: DataTypes.ENUM('individual', 'partnership', 'company', 'llp'),
    allowNull: false,
    defaultValue: 'individual'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  total_products: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_orders: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_revenue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  commission_rate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 5.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  meta_keywords: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'stores',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['slug'] },
    { fields: ['email'] },
    { fields: ['gst_number'] },
    { fields: ['owner_id'] },
    { fields: ['is_active'] },
    { fields: ['is_verified'] }
  ]
});

module.exports = Store;
