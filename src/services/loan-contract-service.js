const { LoanContract, LoanPackage, User } = require('../models');
const { Op } = require('sequelize');

class LoanContractService {
  // Tính lãi suất dựa trên thời gian vay
  static calculateInterestRate(loanPackage, loanTerm) {
    if (loanTerm >= 6 && loanTerm <= 12) {
      return loanPackage.baseInterestRate;
    } else if (loanTerm > 12 && loanTerm <= 24) {
      return loanPackage.interestRate2 || loanPackage.baseInterestRate;
    } else if (loanTerm > 24 && loanTerm <= 36) {
      return loanPackage.interestRate3 || loanPackage.interestRate2 || loanPackage.baseInterestRate;
    } else {
      throw new Error('Thời gian vay phải từ 6-36 tháng');
    }
  }

  // Tính số tiền lãi và tổng số tiền phải trả
  static calculateLoanAmounts(loanAmount, interestRate, loanTerm) {
    const monthlyInterestRate = interestRate / 100 / 12;
    const interestAmount = loanAmount * monthlyInterestRate * loanTerm;
    const totalAmount = loanAmount + interestAmount;
    const emi = totalAmount / loanTerm; // EMI - Equated Monthly Installment
    
    return {
      interestAmount: Math.round(interestAmount),
      totalAmount: Math.round(totalAmount),
      emi: Math.round(emi)
    };
  }

  // Tạo đơn vay mới
  static async createLoanContract(contractData) {
    try {
      // Kiểm tra gói vay có tồn tại không
      const loanPackage = await LoanPackage.findByPk(contractData.loanPackageId);
      if (!loanPackage) {
        throw new Error('Gói vay không tồn tại');
      }

      // Kiểm tra số tiền vay có vượt quá giới hạn không
      if (loanPackage.maxAmount && contractData.loanAmount > loanPackage.maxAmount) {
        throw new Error(`Số tiền vay không được vượt quá ${loanPackage.maxAmount.toLocaleString()} VND`);
      }

      // Tính lãi suất
      const interestRate = this.calculateInterestRate(loanPackage, contractData.loanTerm);

      // Tính các khoản tiền
      const { interestAmount, totalAmount, emi } = this.calculateLoanAmounts(
        contractData.loanAmount,
        interestRate,
        contractData.loanTerm
      );

      // Tạo đơn vay
      const loanContract = await LoanContract.create({
        ...contractData,
        interestRate,
        interestAmount,
        totalAmount,
        EMI: emi, // Use EMI field name to match the model
        status: 'pending'
      });

      return loanContract;
    } catch (error) {
      throw new Error('Lỗi khi tạo đơn vay: ' + error.message);
    }
  }

  // Lấy tất cả đơn vay (Admin)
  static async getAllLoanContracts(queryParams = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        userId,
        loanPackageId,
        search
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereConditions = {};

      // Filter theo status
      if (status) {
        whereConditions.status = status;
      }

      // Filter theo userId
      if (userId) {
        whereConditions.userId = userId;
      }

      // Filter theo loanPackageId
      if (loanPackageId) {
        whereConditions.loanPackageId = loanPackageId;
      }

      // Search theo tên, email, phone
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await LoanContract.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: LoanPackage,
            as: 'loanPackage',
            attributes: ['id', 'name', 'baseInterestRate', 'maxAmount']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'name', 'email']
          }
        ],
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        contracts: rows,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách đơn vay: ' + error.message);
    }
  }

  // Lấy đơn vay theo ID
  static async getLoanContractById(id) {
    try {
      const contract = await LoanContract.findByPk(id, {
        include: [
          {
            model: LoanPackage,
            as: 'loanPackage',
            attributes: ['id', 'name', 'baseInterestRate', 'interestRate2', 'interestRate3', 'maxAmount', 'description1', 'description2', 'description3', 'description4', 'description5', 'description6', 'image']
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'name', 'email', 'phone']
          }
        ]
      });

      if (!contract) {
        throw new Error('Không tìm thấy đơn vay');
      }

      return contract;
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin đơn vay: ' + error.message);
    }
  }

  // Cập nhật trạng thái đơn vay (Admin)
  static async updateLoanContractStatus(id, status, note = null) {
    try {
      const contract = await LoanContract.findByPk(id);
      if (!contract) {
        throw new Error('Không tìm thấy đơn vay');
      }

      const updateData = { status };
      if (note) {
        updateData.note = note;
      }

      // Nếu duyệt, cập nhật ngày ký hợp đồng
      if (status === 'approved') {
        updateData.contractDate = new Date();
      }

      await contract.update(updateData);
      return contract;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật trạng thái đơn vay: ' + error.message);
    }
  }

  // Cập nhật thông tin đơn vay
  static async updateLoanContract(id, contractData) {
    try {
      const contract = await LoanContract.findByPk(id);
      if (!contract) {
        throw new Error('Không tìm thấy đơn vay');
      }

      // Chỉ cho phép cập nhật khi trạng thái là pending
      if (contract.status !== 'pending') {
        throw new Error('Chỉ có thể cập nhật đơn vay đang chờ duyệt');
      }

      // Nếu có thay đổi số tiền vay hoặc thời gian vay, tính lại lãi suất
      if (contractData.loanAmount || contractData.loanTerm || contractData.loanPackageId) {
        let loanPackage;
        if (contractData.loanPackageId && contractData.loanPackageId !== contract.loanPackageId) {
          loanPackage = await LoanPackage.findByPk(contractData.loanPackageId);
          if (!loanPackage) {
            throw new Error('Gói vay không tồn tại');
          }
        } else {
          loanPackage = await LoanPackage.findByPk(contract.loanPackageId);
        }

        const loanAmount = contractData.loanAmount || contract.loanAmount;
        const loanTerm = contractData.loanTerm || contract.loanTerm;

        // Kiểm tra giới hạn số tiền vay
        if (loanPackage.maxAmount && loanAmount > loanPackage.maxAmount) {
          throw new Error(`Số tiền vay không được vượt quá ${loanPackage.maxAmount.toLocaleString()} VND`);
        }

        const interestRate = this.calculateInterestRate(loanPackage, loanTerm);
        const { interestAmount, totalAmount, emi } = this.calculateLoanAmounts(loanAmount, interestRate, loanTerm);

        contractData.interestRate = interestRate;
        contractData.interestAmount = interestAmount;
        contractData.totalAmount = totalAmount;
        contractData.EMI = emi; // Use EMI field name to match the model
      }

      await contract.update(contractData);
      return contract;
    } catch (error) {
      throw new Error('Lỗi khi cập nhật đơn vay: ' + error.message);
    }
  }

  // Xóa đơn vay
  static async deleteLoanContract(id) {
    try {
      const contract = await LoanContract.findByPk(id);
      if (!contract) {
        throw new Error('Không tìm thấy đơn vay');
      }

      // Chỉ cho phép xóa khi trạng thái là pending hoặc rejected
      if (contract.status === 'approved') {
        throw new Error('Không thể xóa đơn vay đã được duyệt');
      }

      await contract.destroy();
      return { message: 'Xóa đơn vay thành công' };
    } catch (error) {
      throw new Error('Lỗi khi xóa đơn vay: ' + error.message);
    }
  }

  // Lấy đơn vay của người dùng hiện tại
  static async getUserLoanContracts(userId, queryParams = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        status
      } = queryParams;

      const offset = (page - 1) * limit;
      const whereConditions = { userId };

      if (status) {
        whereConditions.status = status;
      }

      const { count, rows } = await LoanContract.findAndCountAll({
        where: whereConditions,
        include: [
          {
            model: LoanPackage,
            as: 'loanPackage',
            attributes: ['id', 'name', 'baseInterestRate', 'maxAmount']
          }
        ],
        limit: parseInt(limit),
        offset,
        order: [['createdAt', 'DESC']]
      });

      return {
        contracts: rows,
        totalCount: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page)
      };
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách đơn vay của người dùng: ' + error.message);
    }
  }

  // Thống kê đơn vay
  static async getLoanContractStats() {
    try {
      const totalContracts = await LoanContract.count();
      const pendingContracts = await LoanContract.count({ where: { status: 'pending' } });
      const approvedContracts = await LoanContract.count({ where: { status: 'approved' } });
      const rejectedContracts = await LoanContract.count({ where: { status: 'rejected' } });

      // Tính tổng số tiền vay đã duyệt
      const approvedSum = await LoanContract.sum('loanAmount', { where: { status: 'approved' } });

      return {
        totalContracts,
        pendingContracts,
        approvedContracts,
        rejectedContracts,
        totalApprovedAmount: approvedSum || 0
      };
    } catch (error) {
      throw new Error('Lỗi khi lấy thống kê đơn vay: ' + error.message);
    }
  }
}

module.exports = LoanContractService;
