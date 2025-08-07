var express = require('express');
var router = express.Router();
const AdminLoanContractController = require('../../controllers/admin/loan-contract-controller');
const { authenticateJWT, requireAdmin } = require('../../middleware/auth');

// Thống kê đơn vay
router.get('/stats', authenticateJWT, requireAdmin, AdminLoanContractController.getLoanContractStats);

// CRUD đơn vay
router.get('/', authenticateJWT, requireAdmin, AdminLoanContractController.getAllLoanContracts);
router.get('/:id', authenticateJWT, requireAdmin, AdminLoanContractController.getLoanContractById);
router.put('/:id', authenticateJWT, requireAdmin, AdminLoanContractController.updateLoanContract);
router.put('/:id/status', authenticateJWT, requireAdmin, AdminLoanContractController.updateLoanContractStatus);
router.delete('/:id', authenticateJWT, requireAdmin, AdminLoanContractController.deleteLoanContract);

module.exports = router;
