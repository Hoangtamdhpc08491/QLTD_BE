const express = require('express');
const router = express.Router();
const LoanPackageController = require('../../controllers/admin/loan-package-controller');
const { authenticateJWT } = require('../../middleware/auth');

// Routes cho Loan Package CRUD
router.get('/', authenticateJWT, LoanPackageController.getAllLoanPackages);
router.get('/public', LoanPackageController.getPublicLoanPackages);
router.get('/category/:categoryId', authenticateJWT, LoanPackageController.getLoanPackagesByCategory);
router.get('/:id', authenticateJWT, LoanPackageController.getLoanPackageById);
router.post('/create', authenticateJWT, LoanPackageController.createLoanPackage);
router.put('/update/:id', authenticateJWT, LoanPackageController.updateLoanPackage);
router.delete('/delete/:id', authenticateJWT, LoanPackageController.deleteLoanPackage);

module.exports = router;