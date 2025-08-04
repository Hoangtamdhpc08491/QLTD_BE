const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Category = require('./Category');
const LoanPackage = require('./LoanPackage');
const LoanContract = require('./LoanContract');
const NewsCategory = require('./NewsCategory');
const News = require('./News');
// Define relationships between models



// Category and LoanPackage (One-to-Many)
Category.hasMany(LoanPackage, {
  foreignKey: 'categoryId',
  as: 'loanPackages'
});

LoanPackage.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// User and LoanContract (One-to-Many)
User.hasMany(LoanContract, {
  foreignKey: 'userId',
  as: 'loanContracts'
});

LoanContract.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// LoanPackage and LoanContract (One-to-Many)
LoanPackage.hasMany(LoanContract, {
  foreignKey: 'loanPackageId',
  as: 'loanContracts'
});

LoanContract.belongsTo(LoanPackage, {
  foreignKey: 'loanPackageId',
  as: 'loanPackage'
});
// NewsCategory and News (One-to-Many)
NewsCategory.hasMany(News, {
  foreignKey: 'categoryId',
  as: 'news'
});

News.belongsTo(NewsCategory, {
  foreignKey: 'categoryId',
  as: 'category'
});

// User and News (One-to-Many)
User.hasMany(News, {
  foreignKey: 'uploadBy',
  sourceKey: 'username',
  as: 'news'
});

News.belongsTo(User, {
  foreignKey: 'uploadBy',
  targetKey: 'username',
  as: 'author'
});


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
  Category,
  LoanPackage,
  LoanContract,
  NewsCategory,
  News,
  syncDatabase
};
