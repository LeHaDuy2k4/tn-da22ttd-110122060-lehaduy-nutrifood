import express from 'express';
import { 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    createNotification // 🎯 MỚI THÊM: Import hàm khởi tạo thông báo độc lập
} from '../controllers/notificationsControllers.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🎯 Kích hoạt middleware bảo vệ (yêu cầu đăng nhập) cho TẤT CẢ các API thông báo bên dưới
router.use(protectedRoute);

// 1. Lấy danh sách thông báo & đếm số lượng chưa đọc của User
router.get('/', getUserNotifications);

// 2. Tạo thông báo mới độc lập (Dùng cho hệ thống hoặc test qua Postman)
router.post('/create', createNotification);

// 3. Đánh dấu TẤT CẢ là đã đọc (Lưu ý: Định tuyến tĩnh '/read-all' BẮT BUỘC phải đặt trên định tuyến động '/:id')
router.put('/read-all', markAllAsRead);

// 4. Đánh dấu 1 thông báo cụ thể là đã đọc
router.put('/:id/read', markAsRead);

// 5. Xóa 1 thông báo cụ thể khỏi CSDL
router.delete('/:id', deleteNotification);

export default router;