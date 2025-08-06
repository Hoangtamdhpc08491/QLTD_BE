const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/admin/category-controller');
const { authenticateJWT,requireAdmin } = require('../../middleware/auth');

// Routes cho Category CRUD
router.get('/', authenticateJWT, requireAdmin, CategoryController.getAllCategories);
router.get('/select', authenticateJWT, requireAdmin, CategoryController.getCategoriesForSelect);
router.get('/:id', authenticateJWT, requireAdmin, CategoryController.getCategoryById);
router.post('/create', authenticateJWT, requireAdmin, CategoryController.createCategory);
router.put('/update/:id', authenticateJWT, requireAdmin, CategoryController.updateCategory);
router.delete('/delete/:id', authenticateJWT, requireAdmin, CategoryController.deleteCategory);

module.exports = router;