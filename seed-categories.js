const { sequelize } = require('./src/config/database');
const Category = require('./src/models/Category');
const NewsCategory = require('./src/models/NewsCategory');
const LoanPackage = require('./src/models/LoanPackage');
const News = require('./src/models/News');

// Dữ liệu mẫu cho Categories (Loan Package Categories)
const loanCategories = [
  {
    name: 'Vay kinh doanh',
    description: 'Các gói vay dành cho hoạt động kinh doanh, khởi nghiệp'
  },
  {
    name: 'Vay cá nhân',
    description: 'Các gói vay phục vụ nhu cầu cá nhân, tiêu dùng'
  },
  {
    name: 'Vay thế chấp',
    description: 'Các gói vay có tài sản thế chấp với lãi suất ưu đãi'
  },
  {
    name: 'Vay tín chấp',
    description: 'Các gói vay không cần tài sản đảm bảo'
  }
];

// Dữ liệu mẫu cho News Categories
const newsCategories = [
  {
    name: 'Tin tức ngân hàng',
    description: 'Các tin tức về lĩnh vực ngân hàng, tài chính'
  },
  {
    name: 'Chính sách mới',
    description: 'Thông tin về các chính sách mới trong lĩnh vực tài chính'
  },
  {
    name: 'Hướng dẫn vay vốn',
    description: 'Các bài viết hướng dẫn về quy trình vay vốn'
  },
  {
    name: 'Kiến thức tài chính',
    description: 'Kiến thức cơ bản về tài chính cá nhân và doanh nghiệp'
  },
  {
    name: 'Khuyến mại',
    description: 'Thông tin về các chương trình khuyến mại, ưu đãi'
  },
  {
    name: 'Thông báo',
    description: 'Các thông báo quan trọng từ công ty'
  }
];

// Dữ liệu mẫu cho News
const sampleNews = [
  {
    title: 'Ra mắt gói vay kinh doanh với lãi suất ưu đãi 6.5%/năm',
    content: `Nhằm hỗ trợ các doanh nghiệp vừa và nhỏ trong giai đoạn phục hồi kinh tế, chúng tôi chính thức ra mắt gói vay kinh doanh với mức lãi suất cực kỳ ưu đãi chỉ từ 6.5%/năm.

Đặc điểm nổi bật của gói vay:
- Lãi suất ưu đãi từ 6.5%/năm
- Thời hạn vay linh hoạt từ 1-5 năm
- Hạn mức vay lên đến 5 tỷ đồng
- Thủ tục đơn giản, giải ngân nhanh chóng
- Không yêu cầu tài sản thế chấp cho khoản vay dưới 500 triệu

Điều kiện áp dụng:
- Doanh nghiệp hoạt động từ 2 năm trở lên
- Có báo cáo tài chính rõ ràng
- Ngành nghề kinh doanh phù hợp

Liên hệ ngay hotline 1900-xxxx để được tư vấn chi tiết!`,
    thumbnail: '/images/news/business-loan-promotion.jpg',
    hide: false,
    timeUpload: new Date('2024-01-15'),
    timeActive: new Date('2024-01-15')
  },
  {
    title: 'Hướng dẫn thủ tục vay vốn online nhanh chóng',
    content: `Trong thời đại công nghệ số, việc vay vốn trực tuyến đã trở nên dễ dàng hơn bao giờ hết. Dưới đây là hướng dẫn chi tiết các bước thực hiện:

Bước 1: Đăng ký tài khoản
- Truy cập website chính thức
- Điền đầy đủ thông tin cá nhân
- Xác thực số điện thoại và email

Bước 2: Hoàn thiện hồ sơ
- Upload ảnh CMND/CCCD rõ nét
- Cung cấp thông tin thu nhập
- Chọn gói vay phù hợp

Bước 3: Chờ phê duyệt
- Hệ thống tự động đánh giá hồ sơ
- Thời gian phê duyệt: 15-30 phút
- Nhận thông báo qua SMS/Email

Bước 4: Ký hợp đồng và nhận tiền
- Ký hợp đồng điện tử
- Tiền được chuyển vào tài khoản trong 5 phút

Lưu ý quan trọng:
- Đảm bảo thông tin chính xác, trung thực
- Đọc kỹ điều khoản hợp đồng
- Vay đúng nhu cầu, trả đúng hạn`,
    thumbnail: '/images/news/online-loan-guide.jpg',
    hide: false,
    timeUpload: new Date('2024-02-01'),
    timeActive: new Date('2024-02-01')
  },
  {
    title: 'Chính sách lãi suất mới có hiệu lực từ tháng 3/2024',
    content: `Căn cứ vào tình hình kinh tế và chỉ đạo của Ngân hàng Nhà nước, công ty chúng tôi thông báo điều chỉnh lãi suất cho các sản phẩm vay như sau:

I. Điều chỉnh lãi suất:
1. Vay kinh doanh: Giảm 0.5%/năm
2. Vay cá nhân: Giảm 0.3%/năm  
3. Vay thế chấp: Giảm 0.7%/năm

II. Thời gian áp dụng:
- Từ ngày 01/03/2024
- Áp dụng cho cả khách hàng mới và hiện tại

III. Khách hàng hiện tại:
- Lãi suất được điều chỉnh tự động
- Không cần làm thủ tục bổ sung
- Có hiệu lực từ kỳ thanh toán tiếp theo

IV. Khách hàng mới:
- Được hưởng lãi suất ưu đãi ngay
- Thủ tục không thay đổi
- Cam kết lãi suất cố định 12 tháng đầu

Để biết thêm chi tiết, quý khách vui lòng liên hệ tổng đài 1900-xxxx hoặc đến trực tiếp các chi nhánh.`,
    thumbnail: '/images/news/interest-rate-policy.jpg',
    hide: false,
    timeUpload: new Date('2024-02-28'),
    timeActive: new Date('2024-03-01')
  }
];

async function seedData() {
  try {
    console.log('🚀 Bắt đầu thêm dữ liệu mẫu...');

    // Kết nối database
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Sync models thành công!');

    // 1. Thêm Loan Package Categories
    console.log('\n📦 Thêm danh mục gói vay...');
    for (const categoryData of loanCategories) {
      const [category, created] = await Category.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData
      });
      
      if (created) {
        console.log(`✅ Đã tạo category: ${category.name}`);
      } else {
        console.log(`ℹ️  Category đã tồn tại: ${category.name}`);
      }
    }

    // 2. Thêm News Categories
    console.log('\n📰 Thêm danh mục tin tức...');
    for (const categoryData of newsCategories) {
      const [category, created] = await NewsCategory.findOrCreate({
        where: { name: categoryData.name },
        defaults: categoryData
      });
      
      if (created) {
        console.log(`✅ Đã tạo news category: ${category.name}`);
      } else {
        console.log(`ℹ️  News category đã tồn tại: ${category.name}`);
      }
    }

    // 3. Thêm sample news
    console.log('\n📝 Thêm tin tức mẫu...');
    
    // Lấy news categories để gán cho tin tức
    const bankNewsCategory = await NewsCategory.findOne({ where: { name: 'Tin tức ngân hàng' } });
    const guideCategory = await NewsCategory.findOne({ where: { name: 'Hướng dẫn vay vốn' } });
    const policyCategory = await NewsCategory.findOne({ where: { name: 'Chính sách mới' } });

    // Gán category cho từng tin tức
    const newsWithCategories = [
      { ...sampleNews[0], categoryId: bankNewsCategory?.id },
      { ...sampleNews[1], categoryId: guideCategory?.id },
      { ...sampleNews[2], categoryId: policyCategory?.id }
    ];

    for (const newsData of newsWithCategories) {
      const [news, created] = await News.findOrCreate({
        where: { title: newsData.title },
        defaults: {
          ...newsData,
          uploadBy: 'admin',
          deleteFlag: false
        }
      });
      
      if (created) {
        console.log(`✅ Đã tạo tin tức: ${news.title.substring(0, 50)}...`);
      } else {
        console.log(`ℹ️  Tin tức đã tồn tại: ${news.title.substring(0, 50)}...`);
      }
    }

    // 4. Hiển thị thống kê
    console.log('\n📊 Thống kê dữ liệu:');
    const categoryCount = await Category.count();
    const newsCategoryCount = await NewsCategory.count();
    const loanPackageCount = await LoanPackage.count();
    const newsCount = await News.count();

    console.log(`- Loan Package Categories: ${categoryCount}`);
    console.log(`- News Categories: ${newsCategoryCount}`);
    console.log(`- Loan Packages: ${loanPackageCount}`);
    console.log(`- News Articles: ${newsCount}`);

    console.log('\n🎉 Hoàn thành thêm dữ liệu mẫu!');
    console.log('\n📋 Các API endpoints có thể test:');
    console.log('- GET /api/client/categories (Loan categories)');
    console.log('- GET /api/client/news/categories (News categories)');
    console.log('- GET /api/client/news (All news)');
    console.log('- GET /api/admin/categories (Admin loan categories)');
    console.log('- GET /api/admin/news-categories (Admin news categories)');
    console.log('- GET /api/admin/news (Admin news management)');

  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu:', error);
  } finally {
    await sequelize.close();
    console.log('\n👋 Đã đóng kết nối database');
    process.exit(0);
  }
}

// Chạy script
seedData();
