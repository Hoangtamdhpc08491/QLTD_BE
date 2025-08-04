const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NewsCategory = sequelize.define('NewsCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'news_category_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'news_category',
  timestamps: true
});

module.exports = NewsCategory;
