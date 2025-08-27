const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WalletTxn = sequelize.define('WalletTxn', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  walletId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'wallets',
      key: 'id'
    }
  },
  transactionNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('credit', 'debit'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Balance after this transaction'
  },
  previousBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Balance before this transaction'
  },
  category: {
    type: DataTypes.ENUM('order', 'refund', 'commission', 'delivery_charge', 'withdrawal', 'deposit', 'bonus', 'penalty', 'adjustment', 'other'),
    allowNull: false,
    defaultValue: 'other'
  },
  subcategory: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'More specific category'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  referenceType: {
    type: DataTypes.ENUM('order', 'refund', 'payout', 'adjustment', 'bonus', 'penalty', 'other'),
    allowNull: true,
    comment: 'Type of reference entity'
  },
  referenceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of reference entity'
  },
  referenceNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Reference number (order number, refund number, etc.)'
  },
  isReversible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this transaction can be reversed'
  },
  isReversed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reversedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reversedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  reverseReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  originalTxnId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'wallet_txns',
      key: 'id'
    },
    comment: 'ID of original transaction if this is a reversal'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional transaction metadata'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Internal notes about the transaction'
  },
  isSystem: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'True if this is a system-generated transaction'
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When transaction was processed'
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'completed'
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Reason if transaction failed'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of tags for categorization'
  }
}, {
  tableName: 'wallet_txns',
  timestamps: true,
  hooks: {
    beforeCreate: (txn) => {
      if (!txn.transactionNumber) {
        txn.transactionNumber = `WTX-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      }
    }
  },
  indexes: [
    {
      fields: ['transactionNumber']
    },
    {
      fields: ['walletId']
    },
    {
      fields: ['type']
    },
    {
      fields: ['category']
    },
    {
      fields: ['referenceType']
    },
    {
      fields: ['referenceId']
    },
    {
      fields: ['isReversed']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = WalletTxn;
