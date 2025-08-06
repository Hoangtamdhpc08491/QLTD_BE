const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/admin/category-controller');

// Routes công khai cho categories
router.get('/', CategoryController.getCategoriesForSelect);
router.get('/:id', CategoryController.getCategoryById);

module.exports = router;
