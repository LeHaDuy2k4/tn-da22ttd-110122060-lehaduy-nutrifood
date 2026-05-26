import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

const HomePage = () => {
  return (
    <div className="font-sans text-slate-800 selection:bg-green-200">
      
      {/* 1. HEADER CHỈ XUẤT HIỆN Ở ĐÂY */}
      <Header />

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <span className="flex w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Trợ lý sức khỏe thế hệ mới 2026
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 !text-green-700">
              Thiết kế thực đơn <br/>
              <span className="!text-slate-900">
                Chuẩn cá nhân hóa
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Giải pháp hoàn hảo ứng dụng Trí tuệ nhân tạo (Generative AI) giúp bạn tự động hóa quy trình tư vấn và thiết lập lộ trình dinh dưỡng mỗi ngày.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/signup" 
                className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition duration-300 shadow-lg flex items-center justify-center w-fit mx-auto lg:mx-0"
              >
                Bắt đầu ngay
                <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop" 
              alt="Healthy Food" 
              className="rounded-[3rem] shadow-2xl object-cover h-[500px] w-full"
            />
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 px-4 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold !text-green-700 mb-4">Tính Năng Cốt Lõi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-green-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Gợi Ý Cá Nhân Hóa</h3>
              <p className="text-slate-600 leading-relaxed">Áp dụng thuật toán Hybrid Recommendation giúp đề xuất thực đơn bám sát mục tiêu sức khỏe[cite: 13, 16].</p>
            </div>

            <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-green-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Lộ Trình Tuần (AI)</h3>
              <p className="text-slate-600 leading-relaxed">Ứng dụng Generative AI để tự động thiết kế lộ trình thực đơn chi tiết cho cả tuần[cite: 14].</p>
            </div>

            <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-green-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Trợ Lý Ảo Chatbot</h3>
              <p className="text-slate-600 leading-relaxed">Tích hợp LLMs hỗ trợ hỏi đáp, tư vấn kiến thức dinh dưỡng bằng ngôn ngữ tự nhiên[cite: 15, 23].</p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default HomePage;