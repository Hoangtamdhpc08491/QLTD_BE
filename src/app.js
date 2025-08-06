var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Import database configuration
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');
const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const cors = require('cors');
var app = express();

// Test database connection and sync when app starts
(async () => {
  await testConnection();
  await syncDatabase();
})();
app.use(cors({
  origin: 'localhost:4200', // Cho phép origin từ Angular
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
  credentials: true, // Cho phép cookie và thông tin xác thực khác
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/client',clientRoutes);
app.use('/api/admin', adminRoutes);
module.exports = app;
