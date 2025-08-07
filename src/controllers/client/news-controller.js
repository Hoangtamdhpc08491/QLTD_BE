const NewsService = require('../../services/news-service');
const NewsCategoryService = require('../../services/news-category-service');

class ClientNewsController {
  // Lấy tất cả tin tức (public)
  async getAllNews(req, res) {
    try {
      const { page, limit, categoryId, search } = req.query;
      
      const result = await NewsService.getAllNews({
        page,
        limit,
        categoryId,
        search
      });

      res.json({
        success: true,
        message: 'Lấy danh sách tin tức thành công',
        data: result.news,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalItems: result.totalItems
        }
      });
    } catch (error) {
      console.error('Error in getAllNews:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy tin tức theo ID (public)
  async getNewsById(req, res) {
    try {
      const { id } = req.params;
      const news = await NewsService.getNewsById(id);

      res.json({
        success: true,
        message: 'Lấy thông tin tin tức thành công',
        data: news
      });
    } catch (error) {
      console.error('Error in getNewsById:', error);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy tin tức theo danh mục
  async getNewsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { page, limit } = req.query;

      // Validate category exists
      await NewsCategoryService.validateCategoryExists(categoryId);

      const result = await NewsService.getNewsByCategory(categoryId, {
        page,
        limit
      });

      res.json({
        success: true,
        message: 'Lấy tin tức theo danh mục thành công',
        data: result.news,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalItems: result.totalItems
        }
      });
    } catch (error) {
      console.error('Error in getNewsByCategory:', error);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy danh sách danh mục tin tức (public)
  async getAllNewsCategories(req, res) {
    try {
      const categories = await NewsCategoryService.getNewsCategoriesWithCount();

      res.json({
        success: true,
        message: 'Lấy danh sách danh mục tin tức thành công',
        data: categories
      });
    } catch (error) {
      console.error('Error in getAllNewsCategories:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy danh mục tin tức theo ID (public)
  async getNewsCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await NewsCategoryService.getNewsCategoryById(id);

      res.json({
        success: true,
        message: 'Lấy thông tin danh mục tin tức thành công',
        data: category
      });
    } catch (error) {
      console.error('Error in getNewsCategoryById:', error);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ClientNewsController();
