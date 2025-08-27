const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
    type: DataTypes.ENUM('main', 'commission', 'bonus', 'refund', 'penalty'),
    allowNull: false,
    defaultValue: 'main'
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastTransactionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'wallets',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'userType', 'type']
    }
  ]
});

// Instance methods
Wallet.prototype.addFunds = function(amount) {
  this.balance = parseFloat(this.balance) + parseFloat(amount);
  this.lastTransactionDate = new Date();
  return this;
};

Wallet.prototype.deductFunds = function(amount) {
  if (this.balance >= amount) {
    this.balance = parseFloat(this.balance) - parseFloat(amount);
    this.lastTransactionDate = new Date();
    return true;
  }
  return false;
};

Wallet.prototype.hasSufficientFunds = function(amount) {
  return parseFloat(this.balance) >= parseFloat(amount);
};

Wallet.prototype.getFormattedBalance = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.balance);
};

// Class methods
Wallet.findByUser = function(userId, userType, type = 'main') {
  return this.findOne({
    where: { userId, userType, type, isDeleted: false }
  });
};

Wallet.findOrCreateByUser = async function(userId, userType, type = 'main') {
  let wallet = await this.findByUser(userId, userType, type);
  if (!wallet) {
    wallet = await this.create({
      userId,
      userType,
      type,
      balance: 0.00
    });
  }
  return wallet;
};

Wallet.getTotalBalance = function(userId, userType) {
  return this.sum('balance', {
    where: { userId, userType, isActive: true, isDeleted: false }
  });
};

module.exports = Wallet;
