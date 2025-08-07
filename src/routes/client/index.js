var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({ title: 'Express' });
});

// Import routes
const authRoutes = require('./auth.route');
const loanPackageRoutes = require('./loan-package.route');
const categoryRoutes = require('./category.route');
const newsRoutes = require('./news.route');

// Use routes
router.use('/auth', authRoutes);
router.use('/loan-packages', loanPackageRoutes);
router.use('/categories', categoryRoutes);
router.use('/news', newsRoutes);

module.exports = router;
