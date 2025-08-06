var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({ title: 'Express' });
});
// Import user routes

const authRoutes = require('./auth.route');
router.use('/auth', authRoutes);
module.exports = router;
