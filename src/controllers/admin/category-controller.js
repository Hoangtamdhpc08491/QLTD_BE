const CategoryService = require('../../services/category-service');

class CategoryController {
  // Lấy tất cả categories
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách danh mục thành công',
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy category theo ID
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);
      res.status(200).json({
        success: true,
        message: 'Lấy danh mục thành công',
        data: category
      });
    } catch (error) {
      res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Tạo category mới
  static async createCategory(req, res) {
    try {
      const categoryData = req.body;
      
      // Validation
      if (!categoryData.name) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục là bắt buộc'
        });
      }

      const category = await CategoryService.createCategory(categoryData);
      res.status(201).json({
        success: true,
        message: 'Tạo danh mục thành công',
        data: category
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật category
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const categoryData = req.body;

      // Validation
      if (!categoryData.name) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục là bắt buộc'
        });
      }

      const category = await CategoryService.updateCategory(id, categoryData);
      res.status(200).json({
        success: true,
        message: 'Cập nhật danh mục thành công',
        data: category
      });
    } catch (error) {
      res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa category
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const result = await CategoryService.deleteCategory(id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy categories cho dropdown select
  static async getCategoriesForSelect(req, res) {
    try {
      const categories = await CategoryService.getCategoriesForSelect();
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách danh mục thành công',
        data: categories
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = CategoryController;