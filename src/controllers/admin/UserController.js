const UserService = require('../../services/UserService');

class UserController {
  // GET /users - Lấy tất cả users
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /users/:id - Lấy user theo ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /users - Tạo user mới
  static async createUser(req, res) {
    try {
      const userData = req.body;
      const user = await UserService.createUser(userData);
      res.status(201).json({
        success: true,
        data: user,
        message: 'Tạo user thành công'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /users/:id - Cập nhật user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await UserService.updateUser(id, userData);
      res.status(200).json({
        success: true,
        data: user,
        message: 'Cập nhật user thành công'
      });
    } catch (error) {
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /users/:id - Xóa user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await UserService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UserController;
