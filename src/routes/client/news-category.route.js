const express = require('express');
const router = express.Router();
const ClientNewsController = require('../../controllers/client/news-controller');

// Public routes cho News Categories
router.get('/', ClientNewsController.getAllNewsCategories);
router.get('/:id', ClientNewsController.getNewsCategoryById);

module.exports = router;
