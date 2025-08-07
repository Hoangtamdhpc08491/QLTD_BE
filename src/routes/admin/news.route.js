const express = require('express');
const router = express.Router();
const NewsController = require('../../controllers/admin/news-controller');
const { authenticateJWT } = require('../../middleware/auth');

// Routes cho News CRUD (Admin)
router.get('/', authenticateJWT, NewsController.getAllNews);
router.get('/:id', authenticateJWT, NewsController.getNewsById);
router.post('/create', authenticateJWT, NewsController.createNews);
router.put('/update/:id', authenticateJWT, NewsController.updateNews);
router.delete('/delete/:id', authenticateJWT, NewsController.deleteNews);
router.patch('/toggle-visibility/:id', authenticateJWT, NewsController.toggleVisibility);

module.exports = router;