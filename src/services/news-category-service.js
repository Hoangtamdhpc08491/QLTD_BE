const NewsCategory = require('../models/NewsCategory');
const News = require('../models/News');
const { Op } = require('sequelize');

class NewsCategoryService {
  // Lấy tất cả news categories (public)
  async getAllNewsCategories() {
    const categories = await NewsCategory.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'description', 'createdAt', 'updatedAt']
    });

    return categories;
  }

  // Lấy news category theo ID (public)
  async getNewsCategoryById(id) {
    const category = await NewsCategory.findByPk(id, {
      attributes: ['id', 'name', 'description', 'createdAt', 'updatedAt']
    });

    if (!category) {
      throw new Error('Danh mục tin tức không tồn tại');
    }

    return category;
  }

  // Admin: Lấy tất cả news categories với thống kê
  async getAdminNewsCategories() {
    const categories = await NewsCategory.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: News,
        as: 'news',
        attributes: ['id'],
        where: { deleteFlag: false },
        required: false
      }]
    });

    // Tính số lượng tin tức cho mỗi category
    const categoriesWithCount = categories.map(category => {
      const categoryData = category.toJSON();
      categoryData.newsCount = category.news ? category.news.length : 0;
      delete categoryData.news; // Xóa array news để giảm dung lượng response
      return categoryData;
    });

    return categoriesWithCount;
  }

  // Admin: Tạo news category mới
  async createNewsCategory(categoryData) {
    const { name, description } = categoryData;

    // Validate required fields
    if (!name || name.trim() === '') {
      throw new Error('Tên danh mục là bắt buộc');
    }

    // Check duplicate name
    const existingCategory = await NewsCategory.findOne({
      where: {
        name: {
          [Op.like]: name.trim()
        }
      }
    });

    if (existingCategory) {
      throw new Error('Tên danh mục đã tồn tại');
    }

    const category = await NewsCategory.create({
      name: name.trim(),
      description: description ? description.trim() : null
    });

    return category;
  }

  // Admin: Cập nhật news category
  async updateNewsCategory(id, categoryData) {
    const category = await NewsCategory.findByPk(id);

    if (!category) {
      throw new Error('Danh mục tin tức không tồn tại');
    }

    const { name, description } = categoryData;

    // Validate name if provided
    if (name !== undefined) {
      if (!name || name.trim() === '') {
        throw new Error('Tên danh mục là bắt buộc');
      }

      // Check duplicate name (exclude current category)
      const existingCategory = await NewsCategory.findOne({
        where: {
          id: { [Op.ne]: id },
          name: {
            [Op.like]: name.trim()
          }
        }
      });

      if (existingCategory) {
        throw new Error('Tên danh mục đã tồn tại');
      }
    }

    await category.update({
      name: name ? name.trim() : category.name,
      description: description !== undefined ? (description ? description.trim() : null) : category.description
    });

    return category;
  }

  // Admin: Xóa news category
  async deleteNewsCategory(id) {
    const category = await NewsCategory.findByPk(id);

    if (!category) {
      throw new Error('Danh mục tin tức không tồn tại');
    }

    // Kiểm tra xem có tin tức nào đang sử dụng category này không
    const newsCount = await News.count({
      where: {
        categoryId: id,
        deleteFlag: false
      }
    });

    if (newsCount > 0) {
      throw new Error(`Không thể xóa danh mục vì có ${newsCount} tin tức đang sử dụng danh mục này`);
    }

    await category.destroy();

    return { message: 'Xóa danh mục tin tức thành công' };
  }

  // Lấy news categories với số lượng tin tức (public)
  async getNewsCategoriesWithCount() {
    const categories = await NewsCategory.findAll({
      order: [['name', 'ASC']],
      include: [{
        model: News,
        as: 'news',
        attributes: ['id'],
        where: { 
          deleteFlag: false,
          hide: false 
        },
        required: false
      }]
    });

    // Tính số lượng tin tức cho mỗi category
    const categoriesWithCount = categories.map(category => {
      const categoryData = category.toJSON();
      categoryData.newsCount = category.news ? category.news.length : 0;
      delete categoryData.news;
      return categoryData;
    });

    return categoriesWithCount;
  }

  // Validate category exists
  async validateCategoryExists(id) {
    const category = await NewsCategory.findByPk(id);
    if (!category) {
      throw new Error('Danh mục tin tức không tồn tại');
    }
    return category;
  }
}

module.exports = new NewsCategoryService();
