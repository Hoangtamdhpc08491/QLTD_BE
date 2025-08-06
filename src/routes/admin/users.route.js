var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/admin/user-controller');
const { authenticateJWT, requireAdmin } = require('../../middleware/auth');

router.get('/', authenticateJWT, requireAdmin, UserController.getAllUsers);
router.get('/:id', authenticateJWT, requireAdmin, UserController.getUserById);
router.post('/create', authenticateJWT, requireAdmin, UserController.createUser);
router.put('/update/:id', authenticateJWT, requireAdmin, UserController.updateUser);
router.delete('/delete/:id', authenticateJWT, requireAdmin, UserController.deleteUser);

module.exports = router;
