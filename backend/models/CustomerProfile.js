const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CustomerProfile = sequelize.define('CustomerProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  alternatePhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  phoneVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isKYCVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  kycVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  kycVerifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  kycDocuments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of KYC document URLs'
  },
  kycStatus: {
    type: DataTypes.ENUM('pending', 'submitted', 'verified', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'
  },
  kycRejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Customer preferences and settings'
  },
  marketingConsent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  smsConsent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  emailConsent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  pushConsent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  socialAccounts: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Connected social media accounts'
  },
  referralCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  referredBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  referralCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  referralEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalOrders: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  lastOrderDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLoginDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastActivityDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isVIP: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  vipLevel: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond'),
    allowNull: true
  },
  vipExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes about the customer'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional customer metadata'
  }
}, {
  tableName: 'customer_profiles',
  timestamps: true,
  hooks: {
    beforeCreate: (profile) => {
      if (!profile.referralCode) {
        profile.referralCode = `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      }
    }
  },
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['phone']
    },
    {
      fields: ['isKYCVerified']
    },
    {
      fields: ['kycStatus']
    },
    {
      fields: ['referralCode']
    },
    {
      fields: ['referredBy']
    },
    {
      fields: ['isVIP']
    },
    {
      fields: ['vipLevel']
    },
    {
      fields: ['lastOrderDate']
    }
  ]
});

module.exports = CustomerProfile;
