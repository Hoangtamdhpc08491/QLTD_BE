var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import database configuration
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
var app = express();

// Test database connection and sync when app starts
(async () => {
  await testConnection();
  await syncDatabase();
})();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api',clientRoutes);
app.use('/api/admin', adminRoutes);
module.exports = app;
