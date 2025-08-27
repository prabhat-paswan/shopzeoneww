const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Employee = sequelize.define('Employee', {
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
  department: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'General'
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  reportingTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  leavingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  salaryType: {
    type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly', 'yearly'),
    allowNull: false,
    defaultValue: 'monthly'
  },
  workingHours: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Working hours per day'
  },
  workingDays: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of working days: [1,2,3,4,5,6,7] where 1=Monday'
  },
  shiftStart: {
    type: DataTypes.TIME,
    allowNull: true
  },
  shiftEnd: {
    type: DataTypes.TIME,
    allowNull: true
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
  taxDetails: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Tax identification details'
  },
  performanceRating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  lastReviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextReviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional employee metadata'
  }
}, {
  tableName: 'employees',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['employeeId']
    },
    {
      fields: ['department']
    },
    {
      fields: ['designation']
    },
    {
      fields: ['reportingTo']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isVerified']
    },
    {
      fields: ['joiningDate']
    }
  ]
});

// Self-referencing association for reporting hierarchy
Employee.hasMany(Employee, { as: 'subordinates', foreignKey: 'reportingTo' });
Employee.belongsTo(Employee, { as: 'manager', foreignKey: 'reportingTo' });

module.exports = Employee;
