const express = require('express');
const router = express.Router();
const LoanPackageController = require('../../controllers/admin/loan-package-controller');
const { authenticateJWT, requireAdmin } = require('../../middleware/auth');

// Routes cho Loan Package CRUD
router.get('/', authenticateJWT, requireAdmin, LoanPackageController.getAllLoanPackages);
router.get('/public', LoanPackageController.getPublicLoanPackages);
router.get('/category/:categoryId', authenticateJWT, requireAdmin, LoanPackageController.getLoanPackagesByCategory);
router.get('/:id', authenticateJWT, requireAdmin, LoanPackageController.getLoanPackageById);
router.post('/create', authenticateJWT, requireAdmin, LoanPackageController.createLoanPackage);
router.put('/update/:id', authenticateJWT, requireAdmin, LoanPackageController.updateLoanPackage);
router.delete('/delete/:id', authenticateJWT, requireAdmin, LoanPackageController.deleteLoanPackage);

module.exports = router;