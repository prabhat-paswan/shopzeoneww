const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transactionNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  walletId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userType: {
    type: DataTypes.ENUM('admin', 'vendor', 'customer', 'delivery_man', 'employee'),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(
      'credit',
      'debit',
      'transfer',
      'refund',
      'commission',
      'bonus',
      'penalty',
      'withdrawal',
      'deposit'
    ),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: false,
    defaultValue: 1.000000
  },
  balanceBefore: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referenceType: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  referenceId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  paymentGateway: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gatewayTransactionId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  netAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'transactions',
  hooks: {
    beforeCreate: (transaction) => {
      if (!transaction.transactionNumber) {
        transaction.transactionNumber = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
      transaction.netAmount = transaction.amount - transaction.fees;
    }
  }
});

// Instance methods
Transaction.prototype.process = async function() {
  if (this.status === 'pending') {
    this.status = 'completed';
    this.processedAt = new Date();
    await this.save();
  }
  return this;
};

Transaction.prototype.cancel = async function() {
  if (this.status === 'pending') {
    this.status = 'cancelled';
    await this.save();
  }
  return this;
};

Transaction.prototype.getFormattedAmount = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
};

Transaction.prototype.getFormattedNetAmount = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.netAmount);
};

// Class methods
Transaction.findByTransactionNumber = function(transactionNumber) {
  return this.findOne({ where: { transactionNumber, isDeleted: false } });
};

Transaction.findByUser = function(userId, userType) {
  return this.findAll({
    where: { userId, userType, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Transaction.findByWallet = function(walletId) {
  return this.findAll({
    where: { walletId, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Transaction.findByReference = function(referenceType, referenceId) {
  return this.findAll({
    where: { referenceType, referenceId, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Transaction.findByStatus = function(status) {
  return this.findAll({
    where: { status, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Transaction.getUserBalance = function(userId, userType) {
  return this.findOne({
    attributes: [
      [sequelize.fn('SUM', sequelize.literal('CASE WHEN type = "credit" THEN amount ELSE -amount END')), 'balance']
    ],
    where: { userId, userType, status: 'completed', isDeleted: false }
  });
};

Transaction.getTransactionStats = function(startDate, endDate) {
  return this.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
      [sequelize.fn('SUM', sequelize.literal('CASE WHEN type = "credit" THEN amount ELSE 0 END')), 'credits'],
      [sequelize.fn('SUM', sequelize.literal('CASE WHEN type = "debit" THEN amount ELSE 0 END')), 'debits'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'transactions']
    ],
    where: {
      createdAt: {
        [sequelize.Op.between]: [startDate, endDate]
      },
      status: 'completed',
      isDeleted: false
    },
    group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
    order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
  });
};

module.exports = Transaction;
