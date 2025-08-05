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

// Middleware kiểm tra quyền admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.id) {
    // Lấy user từ DB để kiểm tra role
    User.findByPk(req.user.id).then(user => {
      if (user && user.role === 'admin') {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: 'Bạn không có quyền truy cập chức năng này'
        });
      }
    }).catch(() => {
      res.status(500).json({
        success: false,
        message: 'Lỗi xác thực quyền admin'
      });
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Chưa xác thực'
    });
  }
};

module.exports = {
  authenticateJWT,
  requireAdmin
};
