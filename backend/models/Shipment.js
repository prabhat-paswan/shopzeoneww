const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  carrier: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Shipping carrier (e.g., FedEx, UPS, DHL)'
  },
  method: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Shipping method (e.g., Standard, Express, Overnight)'
  },
  status: {
    type: DataTypes.ENUM('pending', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'),
    allowNull: false,
    defaultValue: 'pending'
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
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
  weight: {
    type: DataTypes.DECIMAL(8, 3),
    allowNull: true,
    defaultValue: 0.000
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object with length, width, height'
  },
  shippingLabel: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL to shipping label'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'shipments',
  timestamps: true,
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['trackingNumber']
    },
    {
      fields: ['carrier']
    },
    {
      fields: ['status']
    },
    {
      fields: ['shippedAt']
    },
    {
      fields: ['deliveredAt']
    }
  ]
});

module.exports = Shipment;
