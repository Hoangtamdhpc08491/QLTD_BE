const NewsCategoryService = require('../../services/news-category-service');

class NewsCategoryController {
  // Lấy tất cả danh mục tin tức (admin)
  async getAllNewsCategories(req, res) {
    try {
      const categories = await NewsCategoryService.getAdminNewsCategories();

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

  // Lấy danh mục tin tức theo ID (admin)
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

  // Tạo danh mục tin tức mới
  async createNewsCategory(req, res) {
    try {
      const categoryData = req.body;
      const category = await NewsCategoryService.createNewsCategory(categoryData);

      res.status(201).json({
        success: true,
        message: 'Tạo danh mục tin tức thành công',
        data: category
      });
    } catch (error) {
      console.error('Error in createNewsCategory:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật danh mục tin tức
  async updateNewsCategory(req, res) {
    try {
      const { id } = req.params;
      const categoryData = req.body;

      const category = await NewsCategoryService.updateNewsCategory(id, categoryData);

      res.json({
        success: true,
        message: 'Cập nhật danh mục tin tức thành công',
        data: category
      });
    } catch (error) {
      console.error('Error in updateNewsCategory:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa danh mục tin tức
  async deleteNewsCategory(req, res) {
    try {
      const { id } = req.params;
      const result = await NewsCategoryService.deleteNewsCategory(id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error in deleteNewsCategory:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new NewsCategoryController();