const express = require('express');
const router = express.Router();
const LoanPackageController = require('../../controllers/admin/loan-package-controller');

// Routes công khai cho loan packages (không cần auth)
router.get('/', LoanPackageController.getPublicLoanPackages);
router.get('/:id', LoanPackageController.getLoanPackageById);
router.get('/category/:categoryId', LoanPackageController.getLoanPackagesByCategory);

module.exports = router;
