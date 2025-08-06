const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/user/auth-controller');
const { authenticateJWT } = require('../../middleware/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/profile', authenticateJWT, AuthController.getProfile);
router.put('/change-password', authenticateJWT, AuthController.changePassword);

module.exports = router;
