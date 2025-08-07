var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({ title: 'Express' });
});

// Import routes
const authRoutes = require('./auth.route');
const loanPackageRoutes = require('./loan-package.route');
const loanContractRoutes = require('./loan-contract.route');
const categoryRoutes = require('./category.route');
const newsRoutes = require('./news.route');
const newsCategoryRoutes = require('./news-category.route');

// Use routes
router.use('/auth', authRoutes);
router.use('/loan-packages', loanPackageRoutes);
router.use('/loan-contracts', loanContractRoutes);
router.use('/categories', categoryRoutes);
router.use('/news', newsRoutes);
router.use('/news-categories', newsCategoryRoutes);

module.exports = router;
