const express = require('express');
const router = express.Router();
const ClientNewsController = require('../../controllers/client/news-controller');

// Public routes cho News
router.get('/', ClientNewsController.getAllNews);
router.get('/categories', ClientNewsController.getAllNewsCategories);
router.get('/categories/:id', ClientNewsController.getNewsCategoryById);
router.get('/category/:categoryId', ClientNewsController.getNewsByCategory);
router.get('/:id', ClientNewsController.getNewsById);

module.exports = router;