var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/admin/UserController');
const { authenticateJWT, requireAdmin } = require('../../middleware/auth');

// GET /users - Lấy tất cả users (cần token)
router.get('/', authenticateJWT, requireAdmin, UserController.getAllUsers);

// GET /users/:id - Lấy user theo ID (cần token)
router.get('/:id', authenticateJWT, requireAdmin, UserController.getUserById);

// POST /users - Tạo user mới (cần token)
router.post('/create', authenticateJWT, requireAdmin, UserController.createUser);

// PUT /users/:id - Cập nhật user (cần token)
router.put('/update/:id', authenticateJWT, requireAdmin, UserController.updateUser);

// DELETE /users/:id - Xóa user (cần token)
router.delete('/delete/:id', authenticateJWT, requireAdmin, UserController.deleteUser);

module.exports = router;
