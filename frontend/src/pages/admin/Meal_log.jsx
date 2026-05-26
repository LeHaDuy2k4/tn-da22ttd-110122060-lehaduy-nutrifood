import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout'; 
import axios from 'axios';
import { toast } from 'sonner'; 

const Meal_log = () => {
  const [mealLogs, setMealLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- STATE CHO PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số bản ghi mỗi trang (Nhật ký thường dài nên để 8 là hợp lý)

  // 1. GỌI API LẤY TOÀN BỘ NHẬT KÝ (DÀNH CHO ADMIN)
  const fetchAllMealLogs = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('nutrifood_token');

      // Gọi API lấy toàn bộ nhật ký của hệ thống
      const res = await axios.get('http://localhost:5001/api/meal-logs/all', { 
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true 
      });
      
      if (res.data) {
        setMealLogs(res.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách nhật ký:", error);
      toast.error("Không thể lấy dữ liệu. Hãy kiểm tra lại phân quyền Admin!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMealLogs();
  }, []);

  // Đặt lại trang 1 mỗi khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 2. XỬ LÝ XÓA BẢN GHI (ADMIN QUYỀN LỰC)
  const handleDelete = async (id, foodName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhật ký món "${foodName}" khỏi hệ thống không?`)) {
      try {
        const token = localStorage.getItem('nutrifood_token');

        await axios.delete(`http://localhost:5001/api/meal-logs/admin/${id}`, { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true 
        });
        
        setMealLogs(mealLogs.filter(log => log._id !== id));
        toast.success(`Đã xóa nhật ký món ${foodName}.`);
      } catch (error) {
        console.error("Lỗi xóa nhật ký:", error);
        toast.error("Không thể xóa bản ghi này.");
      }
    }
  };

  // 3. XỬ LÝ AN TOÀN HIỂN THỊ TÊN NGƯỜI DÙNG
  const renderUserInfo = (user) => {
    if (!user) return 'Người dùng ẩn danh';
    if (user.name) return `bởi ${user.name}`;
    if (user.email) return `bởi ${user.email.split('@')[0]}`;
    // Nếu populate thất bại, user chỉ là chuỗi ID
    if (typeof user === 'string') return `ID: ${user.slice(-6)}`; 
    if (user._id) return `ID: ${user._id.toString().slice(-6)}`;
    return 'Người dùng ẩn danh';
  };

  // --- LOGIC TÌM KIẾM & PHÂN TRANG ---
  const filteredLogs = mealLogs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    const matchFood = log.foodName?.toLowerCase().includes(searchLower);
    const matchType = log.mealType?.toLowerCase().includes(searchLower);
    const matchUser = log.userId?.name?.toLowerCase().includes(searchLower) || false;
    
    return matchFood || matchType || matchUser;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  
  const currentItems = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Hàm format ngày giờ đẹp mắt
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Render màu sắc (Badge) cho từng loại bữa ăn
  const renderMealTypeBadge = (type) => {
    switch(type?.toLowerCase()) {
      case 'sáng': return <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Bữa Sáng</span>;
      case 'trưa': return <span className="bg-orange-100 text-orange-700 border border-orange-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Bữa Trưa</span>;
      case 'tối': return <span className="bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Bữa Tối</span>;
      default: return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Ăn Vặt</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fadeIn pb-10">
        
        {/* Header của trang quản lý */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nhật ký Ăn uống</h1>
            <p className="text-slate-500 text-sm mt-1">Giám sát dữ liệu tiêu thụ thực đơn của người dùng trên toàn hệ thống.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm món ăn, người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-sm font-medium text-slate-700 placeholder-slate-400 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-72 shadow-sm"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bảng Dữ Liệu */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider w-16">STT</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Thông tin món ăn</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Khẩu phần & Năng lượng</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Thời gian ghi nhận</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang đồng bộ dữ liệu nhật ký...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
                      <svg className="w-12 h-12 text-slate-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      Không tìm thấy bản ghi nhật ký nào.
                    </td>
                  </tr>
                ) : (
                  currentItems.map((log, index) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      {/* STT */}
                      <td className="px-6 py-4 text-sm font-bold text-slate-400">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      {/* Thông tin món ăn & Bữa & User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm border border-green-100 shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{log.foodName}</p>
                            <div className="mt-1 flex items-center gap-2">
                              {renderMealTypeBadge(log.mealType)}
                              <span className="text-xs font-medium text-slate-500">
                                {renderUserInfo(log.userId)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Khẩu phần & Calo */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{log.servingsConsumed} phần</span>
                          {log.nutritionSnapshot && log.nutritionSnapshot.calories ? (
                            <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 inline-block w-max mt-1">
                              ~ {log.nutritionSnapshot.calories} kcal
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-400 mt-1">Chưa cập nhật calo</span>
                          )}
                        </div>
                      </td>

                      {/* Thời gian */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          {formatDate(log.consumedAt)}
                        </span>
                      </td>

                      {/* Hành động (Chỉ có Xóa) */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDelete(log._id, log.foodName)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Xóa bản ghi lỗi"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- THANH PHÂN TRANG (PAGINATION) CHUẨN TỪ CATEGORY --- */}
          {!isLoading && filteredLogs.length > 0 && (
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredLogs.length)}</span> trong tổng số <span className="font-bold text-slate-900">{filteredLogs.length}</span> bản ghi
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Trang trước"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg transition-colors ${
                        currentPage === index + 1 
                          ? 'bg-green-600 text-white shadow-sm' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Trang sau"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default Meal_log;