const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DeliveryMan = sequelize.define('DeliveryMan', {
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
  employeeId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  vehicleType: {
    type: DataTypes.ENUM('bike', 'scooter', 'car', 'van', 'truck', 'foot'),
    allowNull: false,
    defaultValue: 'bike'
  },
  vehicleNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  vehicleModel: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  vehicleColor: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  licenseNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  licenseExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  insuranceNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  insuranceExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Delivery zone assignment'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isOnDuty: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  currentLocation: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Current GPS coordinates: {lat, lng}'
  },
  lastLocationUpdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  shiftStart: {
    type: DataTypes.TIME,
    allowNull: true
  },
  shiftEnd: {
    type: DataTypes.TIME,
    allowNull: true
  },
  workingDays: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of working days: [1,2,3,4,5,6,7] where 1=Monday'
  },
  commissionRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: 'Commission percentage per delivery'
  },
  fixedSalary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalDeliveries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  successfulDeliveries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  failedDeliveries: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of document URLs (ID proof, address proof, etc.)'
  },
  emergencyContact: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Emergency contact information'
  },
  bankDetails: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Bank account details for salary'
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  leavingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  verificationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  verificationBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional delivery man metadata'
  }
}, {
  tableName: 'delivery_men',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['employeeId']
    },
    {
      fields: ['zoneId']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isOnDuty']
    },
    {
      fields: ['isAvailable']
    },
    {
      fields: ['vehicleType']
    },
    {
      fields: ['rating']
    }
  ]
});

module.exports = DeliveryMan;
