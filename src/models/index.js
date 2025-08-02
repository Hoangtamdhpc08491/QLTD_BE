const { sequelize } = require('../config/database');
const User = require('./User');

// Định nghĩa relationships giữa các models (nếu có)
// Ví dụ: User.hasMany(Post), Post.belongsTo(User)

// Sync database - tạo bảng nếu chưa tồn tại
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database đã được sync thành công!');
  } catch (error) {
    console.error('❌ Lỗi khi sync database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  syncDatabase
};
