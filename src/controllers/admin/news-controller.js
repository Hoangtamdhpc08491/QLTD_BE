const NewsService = require('../../services/news-service');

class NewsController {
  // Lấy tất cả tin tức (admin)
  async getAllNews(req, res) {
    try {
      const { page, limit, categoryId, search, status } = req.query;
      
      const result = await NewsService.getAdminAllNews({
        page,
        limit,
        categoryId,
        search,
        status
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

  // Lấy tin tức theo ID (admin)
  async getNewsById(req, res) {
    try {
      const { id } = req.params;
      const news = await NewsService.getAdminNewsById(id);

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

  // Tạo tin tức mới
  async createNews(req, res) {
    try {
      const newsData = req.body;
      const uploadBy = req.user?.username || 'admin'; // Lấy từ JWT token

      const news = await NewsService.createNews(newsData, uploadBy);

      res.status(201).json({
        success: true,
        message: 'Tạo tin tức thành công',
        data: news
      });
    } catch (error) {
      console.error('Error in createNews:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật tin tức
  async updateNews(req, res) {
    try {
      const { id } = req.params;
      const newsData = req.body;

      const news = await NewsService.updateNews(id, newsData);

      res.json({
        success: true,
        message: 'Cập nhật tin tức thành công',
        data: news
      });
    } catch (error) {
      console.error('Error in updateNews:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa tin tức
  async deleteNews(req, res) {
    try {
      const { id } = req.params;
      const result = await NewsService.deleteNews(id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in deleteNews:', error);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Ẩn/hiện tin tức
  async toggleVisibility(req, res) {
    try {
      const { id } = req.params;
      const result = await NewsService.toggleNewsVisibility(id);

      res.json({
        success: true,
        message: result.message,
        data: { hidden: result.hidden }
      });
    } catch (error) {
      console.error('Error in toggleVisibility:', error);
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new NewsController();