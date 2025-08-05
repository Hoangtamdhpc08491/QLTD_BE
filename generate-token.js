const jwt = require('jsonwebtoken');
const path = require('path');

// Load .env từ thư mục gốc của project
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { User } = require('./src/models');
const { testConnection } = require('./src/config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Script để generate JWT token cho testing
async function generateTestToken(username = null, userId = null) {
  try {
    // Kiểm tra kết nối database trước
    await testConnection();
    
    let user;
    
    if (username) {
      // Tìm user theo username
      user = await User.findOne({ where: { username } });
      if (!user) {
        console.log(`❌ Không tìm thấy user với username: ${username}`);
        return;
      }
    } else if (userId) {
      // Tìm user theo ID
      user = await User.findByPk(userId);
      if (!user) {
        console.log(`❌ Không tìm thấy user với ID: ${userId}`);
        return;
      }
    } else {
      // Lấy user đầu tiên trong database
      user = await User.findOne();
      if (!user) {
        console.log('❌ Không có user nào trong database');
        console.log('💡 Hãy tạo user trước hoặc sử dụng API /api/auth/register');
        return;
      }
    }

    // Tạo token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('🎉 Token được tạo thành công!');
    console.log('👤 User Info:');
    console.log(`   - ID: ${user.id}`);
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Name: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log('\n🔑 JWT Token:');
    console.log(token);
    console.log('\n📋 Cách sử dụng:');
    console.log('Authorization: Bearer ' + token);
    console.log('\n⏰ Token expires in:', JWT_EXPIRES_IN);

    return token;

  } catch (error) {
    console.error('❌ Lỗi khi tạo token:', error.message);
  }
}

// Chạy script
async function main() {
  console.log('🚀 JWT Token Generator');
  console.log('='.repeat(50));

  // Debug: Kiểm tra biến môi trường
  console.log('🔍 Debug info:');
  console.log(`   - DB_HOST: ${process.env.DB_HOST || 'undefined'}`);
  console.log(`   - DB_USER: ${process.env.DB_USER || 'undefined'}`);
  console.log(`   - DB_NAME: ${process.env.DB_NAME || 'undefined'}`);
  console.log(`   - JWT_SECRET: ${JWT_SECRET ? 'loaded' : 'undefined'}`);
  console.log('');

  // Lấy arguments từ command line
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📝 Tạo token cho user đầu tiên trong database...\n');
    await generateTestToken();
  } else if (args[0] === '--username' || args[0] === '-u') {
    if (args[1]) {
      console.log(`📝 Tạo token cho username: ${args[1]}...\n`);
      await generateTestToken(args[1]);
    } else {
      console.log('❌ Vui lòng cung cấp username');
      showUsage();
    }
  } else if (args[0] === '--id' || args[0] === '-i') {
    if (args[1]) {
      console.log(`📝 Tạo token cho user ID: ${args[1]}...\n`);
      await generateTestToken(null, args[1]);
    } else {
      console.log('❌ Vui lòng cung cấp user ID');
      showUsage();
    }
  } else if (args[0] === '--help' || args[0] === '-h') {
    showUsage();
  } else {
    console.log('❌ Tham số không hợp lệ');
    showUsage();
  }
}

function showUsage() {
  console.log('\n📖 Cách sử dụng:');
  console.log('node generate-token.js                    # Tạo token cho user đầu tiên');
  console.log('node generate-token.js -u username        # Tạo token cho username cụ thể');
  console.log('node generate-token.js -i user_id         # Tạo token cho user ID cụ thể');
  console.log('node generate-token.js --help             # Hiển thị hướng dẫn');
  console.log('\n💡 Ví dụ:');
  console.log('node generate-token.js -u john_doe');
  console.log('node generate-token.js -i 123e4567-e89b-12d3-a456-426614174000');
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  main().then(() => {
    // Đóng kết nối database
    const { sequelize } = require('./src/models');
    sequelize.close();
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Lỗi:', error);
    // Đóng kết nối database nếu có lỗi
    const { sequelize } = require('./src/models');
    sequelize.close();
    process.exit(1);
  });
}

module.exports = { generateTestToken };
