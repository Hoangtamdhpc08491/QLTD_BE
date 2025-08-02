const { Sequelize } = require('sequelize');
require('dotenv').config();

// Tạo instance Sequelize với thông tin từ biến môi trường
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
// Test kết nối database
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');
  } catch (error) {
    console.error('❌ Không thể kết nối database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection
};
