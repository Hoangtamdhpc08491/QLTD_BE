const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LoanContract = sequelize.define('LoanContract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'LoanContractId'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'fullname',
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tên' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập email' },
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: false,
    validate: {
      len: { args: [10, 11], msg: 'Số điện thoại phải từ 10 đến 11 số' }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập địa chỉ' }
    }
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Vui lòng nhập mức lương' }
    }
  },
  maritalStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'maritalStatus'
  },
  job: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthDay: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'BirthDay'
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'Gender'
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'UserId',
    references: {
      model: 'users',
      key: 'UserId'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'approved', 'rejected'],
    allowNull: false,
    field: 'status',
    
  },
    loanPackageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'LoanPackageId',
        references: {
        model: 'loan_package',
        key: 'LoanPackageId'
        }
    },
    loanTerm: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'LoanTerm'
    },
  loanAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'LoanAmount',
    validate: {
      notNull: { msg: 'Vui lòng nhập số tiền vay' },
      isFloat: { msg: 'Số tiền vay phải là một số' }
    }
  },
  interestRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'InterestRate'
  },
  interestAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'InterestAmount'
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'TotalAmount'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'CreatedAt'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'UpdatedAt'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'Note'
  },
  contractDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'ContractDate'
  },
  EMI: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'EMI'
  },
}, {
  tableName: 'loan_contract',
  timestamps: true
});

module.exports = LoanContract;
