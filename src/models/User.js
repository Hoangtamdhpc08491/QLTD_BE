const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'UserId'
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'user_name',
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tên đăng nhập' },
      len: { args: [5, 50], msg: 'Tên đăng nhập phải từ 5 đến 50 ký tự' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập mật khẩu' }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tên' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: { msg: 'Email không hợp lệ' },
      len: { args: [5, 100], msg: 'Email phải từ 5 đến 100 ký tự' }
    }
  },
  phone: {
    type: DataTypes.STRING(11),
    allowNull: false,
    field: 'PhoneNumber',
    validate: {
      len: { args: [10, 11], msg: 'Số điện thoại phải từ 10 đến 11 số' }
    }
  },
  creditRating: {
    type: DataTypes.ENUM,
    values: ['excellent', 'good', 'average', 'poor', 'unknown'],
    allowNull: true,
    defaultValue: 'unknown',
    field: 'CreditRating',
   
  },
  role: {
    type: DataTypes.ENUM,
    values: ['admin', 'user'],
    allowNull: false,
    defaultValue: 'user',
    field: 'Role'
  }
  
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
