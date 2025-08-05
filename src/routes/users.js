var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateJWT } = require('../middleware/auth');

// GET /users - Lấy tất cả users (cần token)
router.get('/', authenticateJWT, UserController.getAllUsers);

// GET /users/:id - Lấy user theo ID (cần token)
router.get('/:id', authenticateJWT, UserController.getUserById);

// POST /users - Tạo user mới (cần token)
router.post('/create', authenticateJWT, UserController.createUser);

// PUT /users/:id - Cập nhật user (cần token)
router.put('/update/:id', authenticateJWT, UserController.updateUser);

// DELETE /users/:id - Xóa user (cần token)
router.delete('/delete/:id', authenticateJWT, UserController.deleteUser);

module.exports = router;
