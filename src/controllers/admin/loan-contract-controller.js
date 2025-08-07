const LoanContractService = require('../../services/loan-contract-service');

class AdminLoanContractController {
  // GET /admin/loan-contracts - Lấy tất cả đơn vay
  static async getAllLoanContracts(req, res) {
    try {
      const queryParams = req.query;
      const result = await LoanContractService.getAllLoanContracts(queryParams);
      
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

  // GET /admin/loan-contracts/:id - Lấy đơn vay theo ID
  static async getLoanContractById(req, res) {
    try {
      const { id } = req.params;
      const contract = await LoanContractService.getLoanContractById(id);
      
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

  // PUT /admin/loan-contracts/:id/status - Cập nhật trạng thái đơn vay
  static async updateLoanContractStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;

      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ'
        });
      }

      const contract = await LoanContractService.updateLoanContractStatus(id, status, note);
      
      res.status(200).json({
        success: true,
        data: contract,
        message: 'Cập nhật trạng thái đơn vay thành công'
      });
    } catch (error) {
      const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /admin/loan-contracts/:id - Cập nhật thông tin đơn vay
  static async updateLoanContract(req, res) {
    try {
      const { id } = req.params;
      const contractData = req.body;
      
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

  // DELETE /admin/loan-contracts/:id - Xóa đơn vay
  static async deleteLoanContract(req, res) {
    try {
      const { id } = req.params;
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

  // GET /admin/loan-contracts/stats - Thống kê đơn vay
  static async getLoanContractStats(req, res) {
    try {
      const stats = await LoanContractService.getLoanContractStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = AdminLoanContractController;
