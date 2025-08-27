const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'product_variants',
      key: 'id'
    }
  },
  storeId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: 'stores',
      key: 'id'
    }
  },
  productName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  productSku: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  finalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  attributes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object with selected attributes and values'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isReturned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  returnReason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  hooks: {
    beforeCreate: (item) => {
      // Calculate total price
      item.totalPrice = item.unitPrice * item.quantity;
      // Calculate final price after discount and tax
      item.finalPrice = item.totalPrice - item.discountAmount + item.taxAmount;
    },
    beforeUpdate: (item) => {
      if (item.changed('unitPrice') || item.changed('quantity')) {
        item.totalPrice = item.unitPrice * item.quantity;
        item.finalPrice = item.totalPrice - item.discountAmount + item.taxAmount;
      }
    }
  }
});

module.exports = OrderItem;
