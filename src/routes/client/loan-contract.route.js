var express = require('express');
var router = express.Router();
const UserLoanContractController = require('../../controllers/user/loan-contract-controller');
const { authenticateJWT } = require('../../middleware/auth');

// Tính toán thông tin vay
router.post('/calculate', authenticateJWT, UserLoanContractController.calculateLoanInfo);

// CRUD đơn vay của người dùng
router.post('/', authenticateJWT, UserLoanContractController.createLoanContract);
router.get('/', authenticateJWT, UserLoanContractController.getUserLoanContracts);
router.get('/:id', authenticateJWT, UserLoanContractController.getUserLoanContractById);
router.put('/:id', authenticateJWT, UserLoanContractController.updateUserLoanContract);
router.delete('/:id', authenticateJWT, UserLoanContractController.deleteUserLoanContract);

module.exports = router;
