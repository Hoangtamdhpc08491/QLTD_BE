const { Category, LoanPackage } = require('../models');

class CategoryService {
  // Lấy tất cả categories
  static async getAllCategories() {
    try {
      const categories = await Category.findAll({
        include: [{
          model: LoanPackage,
          as: 'loanPackages'
        }],
        order: [['id', 'ASC']]
      });
      return categories;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách danh mục: ' + error.message);
    }
  }

  // Lấy category theo ID
  static async getCategoryById(id) {
    try {
      const category = await Category.findByPk(id, {
        include: [{
          model: LoanPackage,
          as: 'loanPackages'
        }]
      });
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }
      return category;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh mục: ' + error.message);
    }
  }

  // Tạo category mới
  static async createCategory(categoryData) {
    try {
      const category = await Category.create(categoryData);
      return category;
    } catch (error) {
      throw new Error('Lỗi khi tạo danh mục: ' + error.message);
    }
  }

  // Cập nhật category
  static async updateCategory(id, categoryData) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }
      
      await category.update(categoryData);
      return category;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật danh mục: ' + error.message);
    }
  }

  // Xóa category
  static async deleteCategory(id) {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Không tìm thấy danh mục');
      }
      
      // Kiểm tra xem category có loan packages không
      const loanPackageCount = await LoanPackage.count({
        where: { categoryId: id }
      });
      
      if (loanPackageCount > 0) {
        throw new Error('Không thể xóa danh mục vì đang có gói vay thuộc danh mục này');
      }
      
      await category.destroy();
      return { message: 'Xóa danh mục thành công' };
    } catch (error) {
      throw new Error('Lỗi khi xóa danh mục: ' + error.message);
    }
  }

  // Lấy categories không bao gồm loan packages
  static async getCategoriesForSelect() {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        order: [['id', 'ASC']],
      });
      return categories;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách danh mục: ' + error.message);
    }
  }
}

module.exports = CategoryService;