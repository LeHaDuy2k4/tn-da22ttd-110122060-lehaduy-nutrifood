import React from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 sm:p-12">
            
            {/* Tiêu đề trang */}
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Chính sách bảo mật</h1>
            <p className="text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">
              NutriFood cam kết bảo vệ tối đa dữ liệu cá nhân của bạn.
            </p>

            {/* Nội dung bảo mật */}
            <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
              
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">1. Thông tin chúng tôi thu thập</h2>
                <p className="mb-2">Để hệ thống AI có thể cá nhân hóa chính xác thực đơn cho bạn, chúng tôi thu thập các loại dữ liệu sau:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Thông tin tài khoản:</strong> Họ tên, Email, Tên đăng nhập và Mật khẩu (đã được mã hóa an toàn).</li>
                  <li><strong>Chỉ số cơ thể & Mục tiêu:</strong> Chiều cao, cân nặng (để tính BMI & TDEE), mục tiêu sức khỏe (giảm cân, tăng cơ...) và mức ngân sách ăn uống.</li>
                  <li><strong>Hành vi sử dụng:</strong> Danh sách món ăn bạn đã thả tim (Favorites), nhật ký tiêu thụ món ăn (Meal Logs), và các sở thích đặc biệt.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">2. Cách chúng tôi sử dụng dữ liệu</h2>
                <p className="mb-2">Toàn bộ dữ liệu được sử dụng duy nhất cho mục đích nâng cao trải nghiệm của bạn trên hệ thống:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Làm đầu vào cho thuật toán Hybrid Recommendation để gợi ý chính xác các món ăn phù hợp với túi tiền và lượng Calo cần thiết.</li>
                  <li>Tự động khởi tạo Lộ trình Dinh dưỡng Tuần (AI Meal Plan) thay vì bạn phải chọn món thủ công.</li>
                  <li>Thống kê và báo cáo tiến trình ăn uống của bạn qua từng ngày.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">3. Bảo mật và Lưu trữ</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Chúng tôi áp dụng các tiêu chuẩn bảo mật hiện đại như sử dụng <strong>JWT Token</strong> để mã hóa phiên đăng nhập và bảo vệ API.</li>
                  <li>Mật khẩu của bạn được mã hóa một chiều trong Cơ sở dữ liệu (MongoDB), hệ thống quản trị viên cũng không thể đọc được mật khẩu gốc của bạn.</li>
                  <li>Chúng tôi cam kết <strong>không bán, trao đổi hay chia sẻ</strong> dữ liệu sức khỏe của bạn cho bất kỳ bên thứ ba nào vì mục đích quảng cáo.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">4. Quyền của Người dùng</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Bạn có toàn quyền truy cập, chỉnh sửa hoặc cập nhật lại các chỉ số cơ thể của mình bất cứ lúc nào trong mục <i>Hồ sơ cá nhân</i>.</li>
                  <li>Bạn có quyền xóa các bản ghi trong Nhật ký ăn uống, gỡ bỏ món ăn yêu thích, hoặc yêu cầu xóa toàn bộ tài khoản vĩnh viễn khỏi hệ thống.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">5. Liên hệ</h2>
                <p>
                  Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này hoặc cần hỗ trợ về dữ liệu cá nhân, vui lòng liên hệ với ban quản trị hệ thống NutriFood để được giải quyết nhanh nhất.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;