const express = require('express');
const router = express.Router();
const NewsController = require('../../controllers/admin/news-controller');
const { authenticateJWT, requireAdmin } = require('../../middleware/auth');

// Routes cho News CRUD (Admin)
router.get('/', authenticateJWT, requireAdmin, NewsController.getAllNews);
router.get('/:id', authenticateJWT, requireAdmin, NewsController.getNewsById);
router.post('/create', authenticateJWT, requireAdmin, NewsController.createNews);
router.put('/update/:id', authenticateJWT, requireAdmin, NewsController.updateNews);
router.delete('/delete/:id', authenticateJWT, requireAdmin, NewsController.deleteNews);
router.patch('/toggle-visibility/:id', authenticateJWT, requireAdmin, NewsController.toggleVisibility);

module.exports = router;