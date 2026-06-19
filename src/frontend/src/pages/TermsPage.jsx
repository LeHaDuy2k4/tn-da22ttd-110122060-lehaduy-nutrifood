import React from 'react';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />
      
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 sm:p-12">
            
            {/* Tiêu đề trang */}
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Điều khoản sử dụng</h1>
            <p className="text-slate-500 font-medium mb-8 pb-8 border-b border-slate-100">
              Cập nhật lần cuối: Tháng 6, 2026
            </p>

            {/* Nội dung điều khoản */}
            <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
              
              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">1. Chấp nhận điều khoản</h2>
                <p>
                  Bằng việc đăng ký, truy cập và sử dụng hệ thống NutriFood, bạn đồng ý tuân thủ hoàn toàn các điều khoản và điều kiện được quy định dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng dịch vụ.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">2. Mục đích và Miễn trừ trách nhiệm Y tế</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>NutriFood là nền tảng công nghệ hỗ trợ gợi ý thực đơn, tính toán lượng Calo và theo dõi dinh dưỡng dựa trên thuật toán và Trí tuệ nhân tạo (AI).</li>
                  <li><strong>Lưu ý quan trọng:</strong> Mọi thông tin, số liệu dinh dưỡng và lộ trình thực đơn do hệ thống cung cấp chỉ mang tính chất <strong>tham khảo</strong> và hỗ trợ mục tiêu cá nhân.</li>
                  <li>NutriFood <strong>không phải là lời khuyên y tế chuyên nghiệp</strong>. Chúng tôi không chịu trách nhiệm thay thế cho các chỉ định của bác sĩ hoặc chuyên gia dinh dưỡng, đặc biệt đối với người dùng có bệnh lý nền (tiểu đường, tim mạch, dị ứng...).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">3. Trách nhiệm của Người dùng</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Cung cấp thông tin cá nhân (Chiều cao, Cân nặng, Độ tuổi, Sở thích) chính xác để thuật toán Recommendation hoạt động hiệu quả nhất.</li>
                  <li>Bảo mật thông tin tài khoản và mật khẩu của mình. Bạn phải chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của bạn.</li>
                  <li>Không sử dụng hệ thống cho mục đích spam, phá hoại, hoặc can thiệp trái phép vào cơ sở dữ liệu của chúng tôi.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">4. Quyền Sở hữu trí tuệ</h2>
                <p>
                  Toàn bộ mã nguồn, thiết kế giao diện, logo, thuật toán gợi ý và cơ sở dữ liệu món ăn trên nền tảng này đều thuộc bản quyền của đội ngũ phát triển NutriFood. Nghiêm cấm mọi hành vi sao chép, trích xuất dữ liệu tự động (crawling) với mục đích thương mại mà không có sự cho phép.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-slate-800 mb-3">5. Thay đổi Dịch vụ và Điều khoản</h2>
                <p>
                  Chúng tôi bảo lưu quyền nâng cấp, sửa đổi hoặc tạm ngừng cung cấp một phần hoặc toàn bộ hệ thống để bảo trì mà không cần báo trước. Các điều khoản này có thể được cập nhật theo thời gian để phù hợp với tình hình thực tế, người dùng nên thường xuyên kiểm tra trang này.
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

export default TermsPage;