const { User } = require('../models');
const bcrypt = require('bcryptjs');




class UserService {
  // Lấy tất cả users
  static async getAllUsers() {
    try {
      const users = await User.findAll({
        order: [['createdAt', 'DESC']]
      });
      return users;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách users: ' + error.message);
    }
  }

  // Lấy user theo ID
  static async getUserById(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Không tìm thấy user');
      }
      return user;
    } catch (error) {
      throw new Error('Lỗi khi lấy user: ' + error.message);
    }
  }

  
  // Tạo user mới
  static async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({ ...userData, password: hashedPassword });
      return user;
    } catch (error) {
      throw new Error('Lỗi khi tạo user: ' + error.message);
    }
  }

  // Cập nhật user
  static async updateUser(id, userData) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Không tìm thấy user');
      }
      
      await user.update(userData);
      return user;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật user: ' + error.message);
    }
  }

  // Xóa user
  static async deleteUser(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('Không tìm thấy user');
      }
      
      await user.destroy();
      return { message: 'Xóa user thành công' };
    } catch (error) {
      throw new Error('Lỗi khi xóa user: ' + error.message);
    }
  }
}

module.exports = UserService;
