const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Zone = sequelize.define('Zone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'United States'
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  postalCodes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of postal codes in this zone'
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Zone boundary coordinates: [{lat, lng}, {lat, lng}, ...]'
  },
  centerLat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  centerLng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  radius: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Zone radius in kilometers'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  deliveryCharge: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  freeDeliveryThreshold: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Order amount above which delivery is free'
  },
  estimatedDeliveryDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3,
    comment: 'Estimated delivery time in days'
  },
  maxDeliveryDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 7,
    comment: 'Maximum delivery time in days'
  },
  workingHours: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Working hours for this zone: {day: {start, end}}'
  },
  holidays: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of holiday dates'
  },
  isHoliday: {
    type: DataTypes.VIRTUAL,
    get() {
      if (!this.holidays) return false;
      const today = new Date().toISOString().split('T')[0];
      return this.holidays.includes(today);
    }
  },
  deliveryMethods: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Available delivery methods: [\'standard\', \'express\', \'same_day\']'
  },
  restrictions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Delivery restrictions for this zone'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional zone metadata'
  }
}, {
  tableName: 'zones',
  timestamps: true,
  indexes: [
    {
      fields: ['code']
    },
    {
      fields: ['country']
    },
    {
      fields: ['state']
    },
    {
      fields: ['city']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['centerLat', 'centerLng']
    }
  ]
});

module.exports = Zone;
