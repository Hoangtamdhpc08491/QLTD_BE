const { LoanPackage, Category, LoanContract } = require('../models');

class LoanPackageService {
  // Lấy tất cả loan packages
  static async getAllLoanPackages() {
    try {
      const loanPackages = await LoanPackage.findAll({
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        order: [['id', 'ASC']]
      });
      return loanPackages;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách gói vay: ' + error.message);
    }
  }

  // Lấy loan package theo ID
  static async getLoanPackageById(id) {
    try {
      const loanPackage = await LoanPackage.findByPk(id, {
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      });
      if (!loanPackage) {
        throw new Error('Không tìm thấy gói vay');
      }
      return loanPackage;
    } catch (error) {
      throw new Error('Lỗi khi lấy gói vay: ' + error.message);
    }
  }

  // Tạo loan package mới
  static async createLoanPackage(loanPackageData) {
    try {
      // Kiểm tra category có tồn tại không (nếu có categoryId)
      if (loanPackageData.categoryId) {
        const category = await Category.findByPk(loanPackageData.categoryId);
        if (!category) {
          throw new Error('Danh mục không tồn tại');
        }
      }

      const loanPackage = await LoanPackage.create(loanPackageData);
      
      // Trả về loan package với thông tin category
      const result = await LoanPackage.findByPk(loanPackage.id, {
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      });
      
      return result;
    } catch (error) {
      throw new Error('Lỗi khi tạo gói vay: ' + error.message);
    }
  }

  // Cập nhật loan package
  static async updateLoanPackage(id, loanPackageData) {
    try {
      const loanPackage = await LoanPackage.findByPk(id);
      if (!loanPackage) {
        throw new Error('Không tìm thấy gói vay');
      }

      // Kiểm tra category có tồn tại không (nếu có categoryId)
      if (loanPackageData.categoryId) {
        const category = await Category.findByPk(loanPackageData.categoryId);
        if (!category) {
          throw new Error('Danh mục không tồn tại');
        }
      }
      
      await loanPackage.update(loanPackageData);
      
      // Trả về loan package với thông tin category
      const result = await LoanPackage.findByPk(id, {
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }]
      });
      
      return result;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật gói vay: ' + error.message);
    }
  }

  // Xóa loan package
  static async deleteLoanPackage(id) {
    try {
      const loanPackage = await LoanPackage.findByPk(id);
      if (!loanPackage) {
        throw new Error('Không tìm thấy gói vay');
      }
      
      // Kiểm tra xem loan package có contracts không
      const contractCount = await LoanContract.count({
        where: { loanPackageId: id }
      });
      
      if (contractCount > 0) {
        throw new Error('Không thể xóa gói vay vì đang có hợp đồng vay thuộc gói này');
      }
      
      await loanPackage.destroy();
      return { message: 'Xóa gói vay thành công' };
    } catch (error) {
      throw new Error('Lỗi khi xóa gói vay: ' + error.message);
    }
  }

  // Lấy loan packages theo category
  static async getLoanPackagesByCategory(categoryId) {
    try {
      const loanPackages = await LoanPackage.findAll({
        where: { categoryId },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        order: [['createdAt', 'DESC']]
      });
      return loanPackages;
    } catch (error) {
      throw new Error('Lỗi khi lấy gói vay theo danh mục: ' + error.message);
    }
  }

  // Lấy loan packages công khai (để hiển thị cho client)
  static async getPublicLoanPackages() {
    try {
      const loanPackages = await LoanPackage.findAll({
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }],
        attributes: ['id', 'name', 'baseInterestRate', 'interestRate2', 'interestRate3', 'description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'image', 'categoryId'],
        order: [['id', 'ASC']]
      });
      return loanPackages;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách gói vay: ' + error.message);
    }
  }
}

module.exports = LoanPackageService;