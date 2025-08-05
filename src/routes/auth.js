const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateJWT } = require('../middleware/auth');

// POST /api/auth/register - Đăng ký
router.post('/register', AuthController.register);

// POST /api/auth/login - Đăng nhập
router.post('/login', AuthController.login);

// GET /api/auth/profile - Lấy thông tin profile (cần token)
router.get('/profile', authenticateJWT, AuthController.getProfile);

// PUT /api/auth/change-password - Đổi mật khẩu (cần token)
router.put('/change-password', authenticateJWT, AuthController.changePassword);

module.exports = router;
