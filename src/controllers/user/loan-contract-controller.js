const LoanContractService = require('../../services/loan-contract-service');

class UserLoanContractController {
  // POST /user/loan-contracts - Tạo đơn vay mới
  static async createLoanContract(req, res) {
    try {
      const userId = req.user.id; // Lấy từ middleware auth
      const contractData = {
        ...req.body,
        userId
      };

      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'address', 'salary', 'job', 'loanPackageId', 'loanTerm', 'loanAmount'];
      const missingFields = requiredFields.filter(field => !contractData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Thiếu thông tin bắt buộc: ${missingFields.join(', ')}`
        });
      }

      const contract = await LoanContractService.createLoanContract(contractData);
      
      res.status(201).json({
        success: true,
        data: contract,
        message: 'Tạo đơn vay thành công'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /user/loan-contracts - Lấy đơn vay của người dùng hiện tại
  static async getUserLoanContracts(req, res) {
    try {
      const userId = req.user.id;
      const queryParams = req.query;
      
      const result = await LoanContractService.getUserLoanContracts(userId, queryParams);
      
      res.status(200).json({
        success: true,
        data: result.contracts,
        pagination: {
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          limit: parseInt(queryParams.limit) || 10
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /user/loan-contracts/:id - Lấy chi tiết đơn vay của người dùng
  static async getUserLoanContractById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const contract = await LoanContractService.getLoanContractById(id);
      
      // Kiểm tra quyền truy cập
      if (contract.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền truy cập đơn vay này'
        });
      }
      
      res.status(200).json({
        success: true,
        data: contract
      });
    } catch (error) {
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /user/loan-contracts/:id - Cập nhật đơn vay của người dùng
  static async updateUserLoanContract(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const contractData = req.body;
      
      // Kiểm tra quyền sở hữu trước khi cập nhật
      const existingContract = await LoanContractService.getLoanContractById(id);
      if (existingContract.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền cập nhật đơn vay này'
        });
      }
      
      const contract = await LoanContractService.updateLoanContract(id, contractData);
      
      res.status(200).json({
        success: true,
        data: contract,
        message: 'Cập nhật đơn vay thành công'
      });
    } catch (error) {
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /user/loan-contracts/:id - Xóa đơn vay của người dùng
  static async deleteUserLoanContract(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Kiểm tra quyền sở hữu trước khi xóa
      const existingContract = await LoanContractService.getLoanContractById(id);
      if (existingContract.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền xóa đơn vay này'
        });
      }
      
      const result = await LoanContractService.deleteLoanContract(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /user/loan-contracts/calculate - Tính toán thông tin vay trước khi tạo đơn
  static async calculateLoanInfo(req, res) {
    try {
      const { loanPackageId, loanAmount, loanTerm } = req.body;

      if (!loanPackageId || !loanAmount || !loanTerm) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin: loanPackageId, loanAmount, loanTerm'
        });
      }

      // Lấy thông tin gói vay
      const { LoanPackage } = require('../../models');
      const loanPackage = await LoanPackage.findByPk(loanPackageId);
      
      if (!loanPackage) {
        return res.status(404).json({
          success: false,
          message: 'Gói vay không tồn tại'
        });
      }

      // Kiểm tra giới hạn số tiền vay
      if (loanPackage.maxAmount && loanAmount > loanPackage.maxAmount) {
        return res.status(400).json({
          success: false,
          message: `Số tiền vay không được vượt quá ${loanPackage.maxAmount.toLocaleString()} VND`
        });
      }

      // Tính lãi suất và các khoản tiền
      const interestRate = LoanContractService.calculateInterestRate(loanPackage, loanTerm);
      const { interestAmount, totalAmount, emi } = LoanContractService.calculateLoanAmounts(
        loanAmount,
        interestRate,
        loanTerm
      );

      res.status(200).json({
        success: true,
        data: {
          loanAmount,
          loanTerm,
          interestRate,
          interestAmount,
          totalAmount,
          emi,
          loanPackage: {
            id: loanPackage.id,
            name: loanPackage.name
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = UserLoanContractController;
