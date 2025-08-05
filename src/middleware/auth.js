const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';

// Middleware xác thực JWT
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ. Vui lòng đăng nhập lại.'
      });
    }

    // Lấy token từ header
    const token = authHeader.split(' ')[1];

    // Xác thực token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Kiểm tra user có tồn tại không
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    // Gắn thông tin user vào request
    req.user = {
      id: decoded.id,
      username: decoded.username
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực: ' + error.message
    });
  }
};

// Middleware kiểm tra token tùy chọn (không bắt buộc)
const optionalJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = {
          id: decoded.id,
          username: decoded.username
        };
      }
    }

    next();

  } catch (error) {
    // Nếu có lỗi, vẫn cho tiếp tục (vì là optional)
    next();
  }
};

module.exports = {
  authenticateJWT,
  optionalJWT
};
