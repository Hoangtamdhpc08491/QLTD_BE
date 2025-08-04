const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'NewsId'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập tiêu đề' }
    }
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'thumbnail'
  },
  
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Vui lòng nhập nội dung' }
    }
  },
  timeUpload: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'TimeUpload'
  },
  timeActive: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'TimeActive'
  },
  hide: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'category_id',
    references: {
      model: 'news_category',
      key: 'news_category_id'
    }
  },
  uploadBy: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'uploadby',
    references: {
      model: 'users',
      key: 'user_name'
    }
  },
  deleteFlag: {
    type: DataTypes.BOOLEAN,
    allowNull: true,    
    defaultValue: false
  },

}, {
  tableName: 'news',
  timestamps: true
});

module.exports = News;
