const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LoanPackage = sequelize.define('LoanPackage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'LoanPackageId'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tên gói vay' }
    }
  },
  baseInterestRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'BaseInterestRate'
  },
  interestRate2: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'InterestRate2'
  },
  interestRate3: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'InterestRate3'
  },
  description1: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'description1',
    validate: {
      notEmpty: { msg: 'Vui lòng nhập mô tả 1' }
    }
  },
  description2: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description2'
  },
  description3: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description3'
  },
  description4: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description4'
  },
  description5: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description5'
  },
  description6: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description6'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'CategoryId',
    references: {
      model: 'category',
      key: 'CategoryId'
    }
  },
  maxAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'MaxAmount'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt'
  }
}, {
  tableName: 'loan_package',
  timestamps: true
});

module.exports = LoanPackage;
