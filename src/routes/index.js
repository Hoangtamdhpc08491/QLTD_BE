var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({ title: 'Express' });
});
// Import user routes
const userRoutes = require('./users');
// Use user routes
router.use('/users', userRoutes);

module.exports = router;
