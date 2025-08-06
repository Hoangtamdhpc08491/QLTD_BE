const LoanPackageService = require('../../services/loan-package-service');

class LoanPackageController {
  // Lấy tất cả loan packages
  static async getAllLoanPackages(req, res) {
    try {
      const loanPackages = await LoanPackageService.getAllLoanPackages();
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách gói vay thành công',
        data: loanPackages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy loan package theo ID
  static async getLoanPackageById(req, res) {
    try {
      const { id } = req.params;
      const loanPackage = await LoanPackageService.getLoanPackageById(id);
      res.status(200).json({
        success: true,
        message: 'Lấy gói vay thành công',
        data: loanPackage
      });
    } catch (error) {
      res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Tạo loan package mới
  static async createLoanPackage(req, res) {
    try {
      const loanPackageData = req.body;
      
      // Validation
      if (!loanPackageData.name) {
        return res.status(400).json({
          success: false,
          message: 'Tên gói vay là bắt buộc'
        });
      }

      if (!loanPackageData.baseInterestRate) {
        return res.status(400).json({
          success: false,
          message: 'Lãi suất cơ bản là bắt buộc'
        });
      }

      if (!loanPackageData.description1) {
        return res.status(400).json({
          success: false,
          message: 'Mô tả 1 là bắt buộc'
        });
      }

      // Validate interest rates
      if (loanPackageData.baseInterestRate < 0 || loanPackageData.baseInterestRate > 100) {
        return res.status(400).json({
          success: false,
          message: 'Lãi suất cơ bản phải từ 0 đến 100'
        });
      }

      const loanPackage = await LoanPackageService.createLoanPackage(loanPackageData);
      res.status(201).json({
        success: true,
        message: 'Tạo gói vay thành công',
        data: loanPackage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật loan package
  static async updateLoanPackage(req, res) {
    try {
      const { id } = req.params;
      const loanPackageData = req.body;

      // Validation
      if (!loanPackageData.name) {
        return res.status(400).json({
          success: false,
          message: 'Tên gói vay là bắt buộc'
        });
      }

      if (!loanPackageData.baseInterestRate) {
        return res.status(400).json({
          success: false,
          message: 'Lãi suất cơ bản là bắt buộc'
        });
      }

      if (!loanPackageData.description1) {
        return res.status(400).json({
          success: false,
          message: 'Mô tả 1 là bắt buộc'
        });
      }

      // Validate interest rates
      if (loanPackageData.baseInterestRate < 0 || loanPackageData.baseInterestRate > 100) {
        return res.status(400).json({
          success: false,
          message: 'Lãi suất cơ bản phải từ 0 đến 100'
        });
      }

      const loanPackage = await LoanPackageService.updateLoanPackage(id, loanPackageData);
      res.status(200).json({
        success: true,
        message: 'Cập nhật gói vay thành công',
        data: loanPackage
      });
    } catch (error) {
      res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa loan package
  static async deleteLoanPackage(req, res) {
    try {
      const { id } = req.params;
      const result = await LoanPackageService.deleteLoanPackage(id);
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

  // Lấy loan packages theo category
  static async getLoanPackagesByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const loanPackages = await LoanPackageService.getLoanPackagesByCategory(categoryId);
      res.status(200).json({
        success: true,
        message: 'Lấy gói vay theo danh mục thành công',
        data: loanPackages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy loan packages công khai (cho client)
  static async getPublicLoanPackages(req, res) {
    try {
      const loanPackages = await LoanPackageService.getPublicLoanPackages();
      res.status(200).json({
        success: true,
        message: 'Lấy danh sách gói vay thành công',
        data: loanPackages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = LoanPackageController;