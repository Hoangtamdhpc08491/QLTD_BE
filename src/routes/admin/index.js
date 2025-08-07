var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({ title: 'Express' });
});

// Import routes
const userRoutes = require('../admin/users.route');
const categoryRoutes = require('../admin/category.route');
const loanPackageRoutes = require('../admin/loan-package.route');
const loanContractRoutes = require('../admin/loan-contract.route');
const newsRoutes = require('../admin/news.route');
const newsCategoryRoutes = require('../admin/news-category.route');

// Use routes
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/loan-packages', loanPackageRoutes);
router.use('/loan-contracts', loanContractRoutes);
router.use('/news', newsRoutes);
router.use('/news-categories', newsCategoryRoutes);

module.exports = router;
