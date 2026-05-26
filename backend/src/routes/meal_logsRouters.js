import express from 'express';
import { 
    createMealLog, 
    getDailyMealLogs, 
    deleteMealLog,
    getAllMealLogsForAdmin,
    adminDeleteMealLog
} from '../controllers/meal_logsControllers.js';

// Nhập thêm middleware isAdmin để bảo vệ các route của quản trị viên
import { protectedRoute, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router(); 

// ==========================================
// NHÓM 1: ROUTES DÀNH CHO NGƯỜI DÙNG CÁ NHÂN
// ==========================================

// Ghi nhận một bữa ăn mới vào nhật ký
router.post("/", protectedRoute, createMealLog);

// Lấy nhật ký theo ngày (Truyền date qua query: /api/meal-logs/daily?date=2026-05-25)
router.get("/daily", protectedRoute, getDailyMealLogs);

// Người dùng tự xóa bản ghi nhật ký của chính mình (nếu nhập nhầm)
router.delete("/:id", protectedRoute, deleteMealLog);


// ==========================================
// NHÓM 2: ROUTES ĐẶC QUYỀN DÀNH CHO ADMIN
// ==========================================

// Lấy toàn bộ nhật ký của tất cả người dùng trên hệ thống
router.get("/all", protectedRoute, isAdmin, getAllMealLogsForAdmin);

// Admin xóa bất kỳ bản ghi nhật ký nào (Xóa rác/lỗi)
router.delete("/admin/:id", protectedRoute, isAdmin, adminDeleteMealLog);


export default router;