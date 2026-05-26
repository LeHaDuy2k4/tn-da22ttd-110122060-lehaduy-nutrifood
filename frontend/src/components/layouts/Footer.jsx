import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand Section - Đồng bộ logo với Header */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
                <span className="text-white font-black text-xl">N</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                Nutri<span className="!text-green-600">Food</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Trợ lý sức khỏe thế hệ mới ứng dụng Generative AI giúp tối ưu hóa dinh dưỡng cá nhân cho người Việt.
            </p>
            <div className="flex space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </div>
            </div>
          </div>

          {/* 2. Services Section */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">Hệ thống</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/categories" className="text-slate-500 hover:text-green-600 text-sm font-medium transition">Thiết kế thực đơn [cite: 14]</Link>
              </li>
              <li>
                <Link to="/ingredients" className="text-slate-500 hover:text-green-600 text-sm font-medium transition">Tra cứu dinh dưỡng</Link>
              </li>
              <li>
                <Link to="/experts" className="text-slate-500 hover:text-green-600 text-sm font-medium transition">Tư vấn chuyên gia [cite: 15]</Link>
              </li>
            </ul>
          </div>

          {/* 3. AI Tools Section */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">Công cụ AI</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/profile" className="text-slate-500 hover:text-green-600 text-sm font-medium transition">Tính toán BMI </Link>
              </li>
              <li>
                <Link to="/history" className="text-slate-500 hover:text-green-600 text-sm font-medium transition">Lịch sử ăn uống </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-slate-500 hover:text-green-600 text-sm font-medium transition">Món ăn yêu thích</Link>
              </li>
            </ul>
          </div>

          {/* 4. Academic Info - Thiết kế lại cho chuyên nghiệp hơn */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-wider">Đồ án tốt nghiệp</h4>
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Sinh viên</span>
                <p className="text-slate-900 font-bold text-sm">Lê Hà Duy [cite: 5]</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Giảng viên hướng dẫn</span>
                <p className="text-slate-900 font-bold text-sm">TS. Đoàn Phước Miền [cite: 61]</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-[11px] font-medium text-center md:text-left">
            © 2026 NutriAI Project. Ngành Công nghệ thông tin - Trường Kỹ thuật và Công nghệ[cite: 1, 4].
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-slate-400 hover:text-green-600 text-[11px] font-bold transition">ĐIỀU KHOẢN</Link>
            <Link to="/privacy" className="text-slate-400 hover:text-green-600 text-[11px] font-bold transition">BẢO MẬT</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;