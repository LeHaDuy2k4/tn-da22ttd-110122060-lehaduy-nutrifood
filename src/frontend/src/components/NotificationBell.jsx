import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Xử lý click ra ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 1. Fetch dữ liệu thông báo (Đã lồng ghép BỘ LỌC ẨN LỖI 503)
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('nutrifood_token');
            if (!token) return;

            const res = await axios.get('http://localhost:5001/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.data) {
                // 🎯 BỘ LỌC FRONTEND: Ẩn các thông báo chứa từ khóa "lỗi 503" hoặc "ngẫu nhiên"
                const filteredNotifs = res.data.notifications.filter(
                    notif => !notif.title.toLowerCase().includes('ngẫu nhiên') && !notif.content.toLowerCase().includes('503')
                );

                const newUnreadCount = filteredNotifs.filter(n => !n.isRead).length;

                setNotifications(filteredNotifs);
                setUnreadCount(newUnreadCount);
            }
        } catch (error) {
            console.error("Lỗi lấy thông báo:", error);
        }
    };

    // 2. Chạy lần đầu và thiết lập tự động cập nhật mỗi 10 giây
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); 
        return () => clearInterval(interval);
    }, []);

    // 3. Đánh dấu 1 thông báo là đã đọc
    const handleRead = async (id, isRead) => {
        if (isRead) return; 
        try {
            const token = localStorage.getItem('nutrifood_token');
            await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái đọc:", error);
        }
    };

    // 4. Đánh dấu tất cả đã đọc
    const handleReadAll = async () => {
        if (unreadCount === 0) return;
        try {
            const token = localStorage.getItem('nutrifood_token');
            await axios.put('http://localhost:5001/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Lỗi read-all:", error);
        }
    };

    // 5. 🎯 HÀM XÓA THÔNG BÁO
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài thẻ cha
        try {
            const token = localStorage.getItem('nutrifood_token');
            await axios.delete(`http://localhost:5001/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Xóa thông báo khỏi giao diện ngay lập tức
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Đã xóa thông báo.");
        } catch (error) {
            console.error("Lỗi xóa thông báo:", error);
            toast.error("Không thể xóa thông báo lúc này.");
        }
    };

    // 6. Hàm định dạng thời gian
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="relative font-sans" ref={dropdownRef}>
            {/* NÚT CÁI CHUÔNG */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/10 ${
                    isOpen || unreadCount > 0 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-white border border-slate-200/60 text-slate-500 hover:text-green-600 hover:border-slate-300 hover:shadow-md'
                }`}
            >
                <svg className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* Badge Số lượng đỏ */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* BẢNG DROPDOWN THÔNG BÁO */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-[340px] sm:w-[380px] bg-white/95 backdrop-blur-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden z-50 animate-slideUp origin-top-right">
                    
                    {/* Header Menu */}
                    <div className="px-5 py-4 border-b border-slate-100/80 bg-slate-50/50 flex justify-between items-center">
                        <h4 className="font-semibold text-slate-800 text-base">Thông báo</h4>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleReadAll}
                                className="text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors"
                            >
                                Đánh dấu đọc tất cả
                            </button>
                        )}
                    </div>
                    
                    {/* Danh sách thông báo */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                </div>
                                <p className="text-sm font-medium text-slate-500">Bạn chưa có thông báo nào.</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif._id} 
                                    onClick={() => handleRead(notif._id, notif.isRead)}
                                    className={`p-4 border-b border-slate-50/80 cursor-pointer transition-all duration-200 group flex gap-3.5 items-start ${
                                        !notif.isRead 
                                            ? 'bg-green-50/40 hover:bg-green-50/80' 
                                            : 'bg-white hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                        notif.type === 'AI_COMPLETED' ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-md' :
                                        notif.type === 'REMINDER' ? 'bg-amber-100 text-amber-600 shadow-sm' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        {notif.type === 'AI_COMPLETED' ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                        ) : notif.type === 'REMINDER' ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        )}
                                    </div>

                                    {/* Nội dung */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm mb-1 ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                                            {notif.title}
                                        </p>
                                        <p className={`text-xs leading-relaxed line-clamp-2 ${!notif.isRead ? 'text-slate-600' : 'text-slate-500'}`}>
                                            {notif.content}
                                        </p>
                                        <p className="text-[11px] font-medium text-slate-400 mt-2">
                                            {formatTime(notif.createdAt)}
                                        </p>
                                    </div>

                                    {/* Khu vực bên phải: Dấu chấm xanh (chưa đọc) HOẶC Nút Xóa thùng rác (đã đọc) */}
                                    {!notif.isRead ? (
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-2 shrink-0 shadow-sm shadow-green-500/50"></div>
                                    ) : (
                                        <button 
                                            onClick={(e) => handleDelete(e, notif._id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shrink-0"
                                            title="Xóa thông báo"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;