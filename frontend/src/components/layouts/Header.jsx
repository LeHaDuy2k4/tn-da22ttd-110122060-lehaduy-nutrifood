import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 🎯 IMPORT THÊM useLocation
import { useAuthStore } from '../../stores/useAuthStores'; 
import axios from 'axios'; 

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [categories, setCategories] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  
  const navigate = useNavigate();
  const location = useLocation(); // 🎯 LẤY THÔNG TIN ĐƯỜNG DẪN HIỆN TẠI
  const { user, signOut } = useAuthStore();

  // 1. LẤY DANH MỤC TỪ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/categories');
        if (res.data) {
          const activeCategories = res.data.filter(cat => cat.isActive !== false);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục thức ăn cho Header:", error);
        setCategories([
          { _id: 'cat1', name: 'Bữa sáng lành mạnh', isActive: true },
          { _id: 'cat2', name: 'Bữa trưa dinh dưỡng', isActive: true }
        ]);
      }
    };
    fetchCategories();
  }, []);

  // 2. HIỆU ỨNG SCROLL
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🎯 3. ĐỒNG BỘ THANH TÌM KIẾM VỚI URL
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const searchFromUrl = currentParams.get('search') || '';
    setSearchQuery(searchFromUrl); // Tự động điền text vào ô input nếu trên URL có
  }, [location.search]);

  // 🎯 4. LOGIC TÌM KIẾM TỐI ƯU
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    // Lấy lại các tham số hiện tại trên URL (ví dụ: category=123)
    const currentParams = new URLSearchParams(location.search);

    if (trimmedQuery) {
      // Nếu có chữ -> Cập nhật/Thêm tham số search
      currentParams.set('search', trimmedQuery);
    } else {
      // Nếu ô tìm kiếm trống -> Xóa tham số search (để hiện tất cả món)
      currentParams.delete('search');
    }

    // Chuyển hướng sang trang menu kèm theo toàn bộ tham số mới
    navigate(`/menu?${currentParams.toString()}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/'); 
  };

  return (
    <nav 
      className={`fixed w-full z-50 top-0 start-0 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-3' 
          : 'bg-white md:bg-transparent py-4 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
        
        {/* LỚP 1: LOGO THƯƠNG HIỆU */}
        <Link to="/" className="flex items-center space-x-2 group shrink-0">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900 hidden sm:block">
            Nutri<span className="!text-green-600">Food</span>
          </span>
        </Link>

        {/* LỚP 2: KHU VỰC TRUNG TÂM */}
        <div className="flex-1 max-w-2xl flex items-center space-x-4">
          
          {/* DROPDOWN DANH MỤC */}
          <div 
            className="relative shrink-0 hidden md:block" 
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className="text-sm font-bold text-slate-600 hover:text-green-600 transition flex items-center space-x-1 py-2"
            >
              <span>Danh mục</span>
              <svg className={`w-4 h-4 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 pt-3 w-64 z-50 animate-fadeIn">
                <div className="bg-white border border-slate-100 shadow-xl rounded-2xl overflow-hidden py-2">
                  
                  <Link
                    to="/menu"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-5 py-3 text-sm font-black text-green-600 hover:bg-green-50 transition duration-150 border-b border-slate-50"
                  >
                    Tất cả món ăn
                  </Link>

                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/menu?category=${cat._id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-5 py-3 text-sm font-semibold text-slate-600 hover:text-green-600 hover:bg-green-50/60 transition duration-150"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-5 py-3 text-sm text-slate-400 italic">Đang cập nhật danh mục...</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* THANH TÌM KIẾM */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/80 text-slate-700 placeholder-slate-400 text-sm font-medium pl-11 pr-4 py-2.5 rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-200"
              />
              <button 
                type="submit" 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* LỚP 3: NHÓM NÚT HÀNH ĐỘNG BÊN PHẢI */}
        <div className="flex items-center space-x-3 shrink-0">
          
          {user ? (
            <div className="flex items-center space-x-2">
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="hidden lg:flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-green-600 transition px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                  </svg>
                  <span>Trang Quản Lý</span>
                </Link>
              )}

              <Link 
                to="/profile" 
                className="hidden md:flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-green-600 transition px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Trang cá nhân</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white text-sm font-bold px-4 md:px-5 py-2 rounded-full transition-all duration-300 ml-2"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/signin" 
                className="hidden sm:block text-sm font-bold text-slate-700 hover:text-green-600 px-4 py-2 transition"
              >
                Đăng nhập
              </Link>
              
              <Link 
                to="/signup" 
                className="bg-slate-900 text-white text-sm font-bold px-5 md:px-6 py-2.5 rounded-full hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Tham gia ngay
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Header;