const News = require('../models/News');
const NewsCategory = require('../models/NewsCategory');
const { Op } = require('sequelize');

class NewsService {
  // Lấy tất cả news (public)
  async getAllNews(options = {}) {
    const { page = 1, limit = 10, categoryId, search } = options;
    const offset = (page - 1) * limit;
    
    const whereClause = {
      deleteFlag: false,
      hide: false
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await News.findAndCountAll({
      where: whereClause,
      include: [{
        model: NewsCategory,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['timeUpload', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      news: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count
    };
  }

  // Lấy news theo ID (public)
  async getNewsById(id) {
    const news = await News.findOne({
      where: { 
        id,
        deleteFlag: false,
        hide: false 
      },
      include: [{
        model: NewsCategory,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    if (!news) {
      throw new Error('Tin tức không tồn tại');
    }

    return news;
  }

  // Admin: Lấy tất cả news (bao gồm ẩn)
  async getAdminAllNews(options = {}) {
    const { page = 1, limit = 10, categoryId, search, status } = options;
    const offset = (page - 1) * limit;
    
    const whereClause = {
      deleteFlag: false
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status !== undefined) {
      whereClause.hide = status === 'hidden';
    }

    const { count, rows } = await News.findAndCountAll({
      where: whereClause,
      include: [{
        model: NewsCategory,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      news: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count
    };
  }

  // Admin: Tạo news mới
  async createNews(newsData, uploadBy) {
    const {
      title,
      content,
      thumbnail,
      categoryId,
      timeUpload,
      timeActive,
      createdAt = new Date(),
      updatedAt = new Date(),
      hide = false
    } = newsData;

    // Validate required fields
    if (!title || !content) {
      throw new Error('Tiêu đề và nội dung là bắt buộc');
    }

    // Validate category exists if provided
    if (categoryId) {
      const category = await NewsCategory.findByPk(categoryId);
      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }
    }

    const news = await News.create({
      title,
      content,
      thumbnail,
      categoryId: categoryId || null,
      timeUpload: timeUpload || new Date(),
      timeActive: timeActive || new Date(),
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date(),
      hide,
      uploadBy,
      deleteFlag: false
    });

    // Reload with category
    const createdNews = await this.getAdminNewsById(news.id);
    return createdNews;
  }

  // Admin: Cập nhật news
  async updateNews(id, newsData) {
    const news = await News.findOne({
      where: { id, deleteFlag: false }
    });

    if (!news) {
      throw new Error('Tin tức không tồn tại');
    }

    const {
      title,
      content,
      thumbnail,
      categoryId,
      timeUpload,
      timeActive,
      hide
    } = newsData;

    // Validate category exists if provided
    if (categoryId) {
      const category = await NewsCategory.findByPk(categoryId);
      if (!category) {
        throw new Error('Danh mục không tồn tại');
      }
    }

    await news.update({
      title: title || news.title,
      content: content || news.content,
      thumbnail: thumbnail !== undefined ? thumbnail : news.thumbnail,
      categoryId: categoryId !== undefined ? categoryId : news.categoryId,
      timeUpload: timeUpload || news.timeUpload,
      timeActive: timeActive || news.timeActive,
      hide: hide !== undefined ? hide : news.hide
    });

    // Reload with category
    const updatedNews = await this.getAdminNewsById(id);
    return updatedNews;
  }

  // Admin: Lấy news theo ID (bao gồm ẩn)
  async getAdminNewsById(id) {
    const news = await News.findOne({
      where: { 
        id,
        deleteFlag: false 
      },
      include: [{
        model: NewsCategory,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    if (!news) {
      throw new Error('Tin tức không tồn tại');
    }

    return news;
  }

  // Admin: Xóa news (soft delete)
  async deleteNews(id) {
    const news = await News.findOne({
      where: { id, deleteFlag: false }
    });

    if (!news) {
      throw new Error('Tin tức không tồn tại');
    }

    await news.update({ deleteFlag: true });

    return { message: 'Xóa tin tức thành công' };
  }

  // Admin: Ẩn/hiện news
  async toggleNewsVisibility(id) {
    const news = await News.findOne({
      where: { id, deleteFlag: false }
    });

    if (!news) {
      throw new Error('Tin tức không tồn tại');
    }

    await news.update({ hide: !news.hide });

    return { 
      message: news.hide ? 'Đã ẩn tin tức' : 'Đã hiện tin tức',
      hidden: news.hide
    };
  }

  // Lấy tin tức theo category
  async getNewsByCategory(categoryId, options = {}) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await News.findAndCountAll({
      where: { 
        categoryId,
        deleteFlag: false,
        hide: false 
      },
      include: [{
        model: NewsCategory,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['timeUpload', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return {
      news: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalItems: count
    };
  }
}

module.exports = new NewsService();
