const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  storeId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  deliveryManId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'packaging',
      'out_for_delivery',
      'delivered',
      'returned',
      'failed',
      'cancelled'
    ),
    allowNull: false,
    defaultValue: 'pending'
  },
  orderType: {
    type: DataTypes.ENUM('inhouse', 'vendor'),
    allowNull: false,
    defaultValue: 'vendor'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
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
  transactionId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  commissionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  vendorAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.00
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
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.JSON,
    allowNull: true
  },
  shippingMethod: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  customerNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
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
  tableName: 'orders',
  hooks: {
    beforeCreate: (order) => {
      if (!order.orderNumber) {
        order.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
      if (!order.billingAddress) {
        order.billingAddress = order.shippingAddress;
      }
    },
    beforeUpdate: (order) => {
      if (order.changed('status') && order.status === 'delivered' && !order.actualDelivery) {
        order.actualDelivery = new Date();
      }
    }
  }
});

// Instance methods
Order.prototype.calculateTotals = function() {
  this.totalAmount = this.subtotal + this.taxAmount + this.shippingAmount - this.discountAmount;
  this.vendorAmount = this.totalAmount - this.commissionAmount;
  return this;
};

Order.prototype.canTransitionTo = function(newStatus) {
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['packaging', 'cancelled'],
    packaging: ['out_for_delivery', 'cancelled'],
    out_for_delivery: ['delivered', 'failed'],
    delivered: ['returned'],
    failed: ['confirmed', 'cancelled'],
    returned: ['confirmed'],
    cancelled: []
  };
  
  return validTransitions[this.status]?.includes(newStatus) || false;
};

Order.prototype.getStatusColor = function() {
  const statusColors = {
    pending: 'yellow',
    confirmed: 'blue',
    packaging: 'purple',
    out_for_delivery: 'orange',
    delivered: 'green',
    returned: 'red',
    failed: 'red',
    cancelled: 'gray'
  };
  return statusColors[this.status] || 'gray';
};

Order.prototype.getStatusLabel = function() {
  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    packaging: 'Packaging',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    returned: 'Returned',
    failed: 'Failed to Deliver',
    cancelled: 'Cancelled'
  };
  return statusLabels[this.status] || this.status;
};

Order.prototype.isEditable = function() {
  return ['pending', 'confirmed', 'packaging'].includes(this.status);
};

Order.prototype.isCancellable = function() {
  return ['pending', 'confirmed', 'packaging'].includes(this.status);
};

// Class methods
Order.findByOrderNumber = function(orderNumber) {
  return this.findOne({ where: { orderNumber, isDeleted: false } });
};

Order.findByCustomer = function(customerId) {
  return this.findAll({
    where: { customerId, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Order.findByStore = function(storeId) {
  return this.findAll({
    where: { storeId, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Order.findByStatus = function(status) {
  return this.findAll({
    where: { status, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Order.findByDeliveryMan = function(deliveryManId) {
  return this.findAll({
    where: { deliveryManId, isDeleted: false },
    order: [['createdAt', 'DESC']]
  });
};

Order.getStatusCounts = function() {
  return this.findAll({
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    where: { isDeleted: false },
    group: ['status']
  });
};

Order.getRevenueStats = function(startDate, endDate) {
  return this.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
      [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
    ],
    where: {
      createdAt: {
        [sequelize.Op.between]: [startDate, endDate]
      },
      paymentStatus: 'paid',
      isDeleted: false
    },
    group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
    order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
  });
};

module.exports = Order;
