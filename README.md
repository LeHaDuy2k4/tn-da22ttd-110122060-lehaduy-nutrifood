🥗 NutriFood - Website Gợi Ý Thực Đơn Dinh Dưỡng Thông Minh
1. Giới thiệu
NutriFood là hệ thống web ứng dụng trí tuệ nhân tạo (AI) nhằm hỗ trợ người dùng xây dựng chế độ ăn uống khoa học, cá nhân hóa theo thể trạng (BMI), mục tiêu sức khỏe và ngân sách tài chính. Dự án giúp giải quyết khó khăn trong việc lên kế hoạch thực đơn hằng ngày, tiết kiệm thời gian và đảm bảo cân bằng dinh dưỡng.

2. Mục tiêu đồ án
Cá nhân hóa: Đề xuất thực đơn dựa trên chỉ số sinh trắc học và sở thích cá nhân.
Thông minh hóa: Tích hợp Generative AI để tự động tạo lộ trình ăn uống trong 7 ngày và tư vấn dinh dưỡng thời gian thực qua Chatbot.
Tối ưu hóa: Hỗ trợ tính toán chi phí và dinh dưỡng (Macro) chi tiết cho từng món ăn.
Trải nghiệm: Xây dựng giao diện trực quan, dễ sử dụng, tương thích đa thiết bị.

3. Kiến trúc hệ thống
Hệ thống được phát triển theo mô hình MERN Stack (MongoDB, Express, React, Node.js):
Frontend: React.js, Tailwind CSS, Vite (Tối ưu trải nghiệm người dùng).
Backend: Node.js, Express.js (Xử lý nghiệp vụ, quản lý API, kết nối AI).
Database: MongoDB (Lưu trữ dữ liệu phi cấu trúc linh hoạt).
AI Service: Google Gemini API (Tạo thực đơn & Tư vấn dinh dưỡng).

4. Phần mềm & Công nghệ cần thiết
Trước khi cài đặt, hãy đảm bảo bạn đã cài đặt các công cụ sau trên máy tính:
Node.js: Phiên bản LTS (khuyên dùng v18 hoặc mới hơn).
MongoDB: Cài đặt MongoDB Community Server hoặc sử dụng MongoDB Atlas.
Git: Để quản lý mã nguồn.
Trình quản lý gói: npm (đi kèm với Node.js).
IDE: VS Code (khuyên dùng).

5. Hướng dẫn cài đặt & Chạy chương trình
Bước 1: Clone dự án
Bash
git clone [https://github.com/LeHaDuy2k4/tn-da22ttd-110122060-lehaduy-nutrifood.git]
cd src

Bước 2: Cài đặt Backend
Bash
cd backend
npm install
# Tạo file .env và điền các biến cấu hình:
# PORT=5001
# MONGODB_URI=mongodb://127.0.0.1:27017/nutrifood
# GEMINI_API_KEY=your_api_key_here
npm run dev

Bước 3: Cài đặt Frontend
Mở một terminal mới:
Bash
cd frontend
npm install
npm run dev

Bước 4: Truy cập hệ thống
Sau khi các dịch vụ đã chạy, truy cập vào trình duyệt theo địa chỉ:
Frontend: http://localhost:5173
Backend API: http://localhost:5001

6. Tính năng nổi bật
✨ Lộ trình AI: Tự động tạo menu chuẩn khoa học chỉ trong vài giây.
🤖 Chatbot Tư vấn: Giải đáp mọi thắc mắc về thực phẩm và công thức.
📊 Nhật ký Dinh dưỡng: Theo dõi Calo, Protein, Carbs, Fat theo thời gian thực.
💸 Quản lý Ngân sách: Gợi ý thực đơn phù hợp với túi tiền.

7. Đóng góp
Đồ án này được thực hiện bởi Lê Hà Duy - Sinh viên ngành Công nghệ thông tin, Đại học Trà Vinh. Mọi góp ý hoặc phản hồi vui lòng gửi về email: [lehaduy2004@gmail.com].