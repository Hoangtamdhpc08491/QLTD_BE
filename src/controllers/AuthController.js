const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

class AuthController {
  // Đăng ký user mới
  static async register(req, res) {
    try {
      const { username, password, name, email, phone } = req.body;

      // Kiểm tra user đã tồn tại chưa
      const existingUser = await User.findOne({ 
        where: { username } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Tên đăng nhập đã tồn tại'
        });
      }

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
      const user = await User.create({
        username,
        password: hashedPassword,
        name,
        email,
        phone
      });

      // Tạo JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công',
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          creditRating: user.creditRating
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng ký: ' + error.message
      });
    }
  }

  // Đăng nhập
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Kiểm tra thông tin đầu vào
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu'
        });
      }

      // Tìm user theo username
      const user = await User.findOne({ 
        where: { username } 
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng'
        });
      }

      // Kiểm tra mật khẩu
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không đúng'
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          creditRating: user.creditRating
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đăng nhập: ' + error.message
      });
    }
  }

  // Lấy thông tin user hiện tại (cần token)
  static async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy user'
        });
      }

      res.json({
        success: true,
        user
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin profile: ' + error.message
      });
    }
  }

  // Đổi mật khẩu
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới'
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy user'
        });
      }

      // Kiểm tra mật khẩu hiện tại
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Mật khẩu hiện tại không đúng'
        });
      }

      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu
      await user.update({ password: hashedNewPassword });

      res.json({
        success: true,
        message: 'Đổi mật khẩu thành công'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi đổi mật khẩu: ' + error.message
      });
    }
  }
}

module.exports = AuthController;
