var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');

// GET /users - Lấy tất cả users
router.get('/', UserController.getAllUsers);

// GET /users/:id - Lấy user theo ID
router.get('/:id', UserController.getUserById);

// POST /users - Tạo user mới
router.post('/', UserController.createUser);

// PUT /users/:id - Cập nhật user
router.put('/:id', UserController.updateUser);

// DELETE /users/:id - Xóa user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
