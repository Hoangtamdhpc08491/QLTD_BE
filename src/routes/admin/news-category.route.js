const express = require('express');
const router = express.Router();
const NewsCategoryController = require('../../controllers/admin/news-category-controller');
const { authenticateJWT, requireAdmin } = require('../../middleware/auth');

router.get('/', authenticateJWT, NewsCategoryController.getAllNewsCategories);
router.get('/:id', authenticateJWT, NewsCategoryController.getNewsCategoryById);
router.post('/create', authenticateJWT, requireAdmin, NewsCategoryController.createNewsCategory);
router.put('/update/:id', authenticateJWT, requireAdmin, NewsCategoryController.updateNewsCategory);
router.delete('/delete/:id', authenticateJWT, requireAdmin, NewsCategoryController.deleteNewsCategory);

module.exports = router;