import MealLog from "../models/Meal_log.js";
import Notification from "../models/Notification.js"; // 🎯 IMPORT TRẠM THÔNG BÁO

// ==========================================
// CÁC API DÀNH CHO NGƯỜI DÙNG (USER)
// ==========================================

// 1. Thêm nhật ký bữa ăn (Đã tối ưu chặn trùng lặp & Nhắc nhở thông minh)
export const createMealLog = async (req, res) => {
    try {
        const { mealId, foodName, mealType, servingsConsumed, consumedAt, notes, nutritionSnapshot } = req.body;
        const userId = req.user._id || req.user.id;

        // Xác định mốc thời gian người dùng muốn thêm (Mặc định là hiện tại)
        const logDate = consumedAt ? new Date(consumedAt) : new Date();

        // 🎯 1. TẠO KHOẢNG THỜI GIAN TRONG NGÀY ĐỂ QUÉT TRÙNG LẶP
        const startOfDay = new Date(logDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(logDate);
        endOfDay.setHours(23, 59, 59, 999);

        // 🎯 2. KIỂM TRA TRÙNG LẶP (Đã có bữa ăn này trong ngày chưa?)
        const existingLog = await MealLog.findOne({
            userId,
            mealType, // Bữa sáng, Bữa trưa, Bữa tối, hoặc Bữa phụ
            consumedAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingLog) {
            return res.status(400).json({ 
                success: false, 
                message: `Bạn đã có món "${existingLog.foodName}" cho ${mealType} của ngày này rồi. Vui lòng xóa món cũ trước khi thêm món mới.` 
            });
        }

        // 🎯 3. TẠO MỚI NẾU KHÔNG BỊ TRÙNG
        const newLog = new MealLog({
            userId,
            mealId: mealId || null, 
            foodName,
            mealType,
            servingsConsumed,
            consumedAt: logDate,
            notes,
            nutritionSnapshot: nutritionSnapshot || undefined 
        });

        const savedLog = await newLog.save();

        // 🎯 4. KỊCH BẢN THÔNG BÁO TỨC THÌ: KIỂM TRA NẾU NGÀY ĂN LÀ "HÔM NAY"
        const today = new Date();
        const isToday = logDate.getDate() === today.getDate() &&
                        logDate.getMonth() === today.getMonth() &&
                        logDate.getFullYear() === today.getFullYear();

        if (isToday) {
            try {
                await Notification.create({
                    userId: userId,
                    type: 'REMINDER', // Hiện icon đồng hồ màu cam
                    title: `🍽️ Lên lịch cho ${mealType} hôm nay!`,
                    content: `Bạn vừa thêm món "${foodName}" vào thực đơn. Tới bữa nhớ ghi nhận lại nhé!`
                });
            } catch (notifErr) {
                console.error("⚠️ Lỗi gửi thông báo nhắc nhở tức thì:", notifErr.message);
            }
        }

        return res.status(201).json({ success: true, message: "Đã ghi nhận bữa ăn thành công", log: savedLog });
    } catch (error) {
        console.error("🔥 Lỗi createMealLog:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống khi tạo nhật ký." });
    }
};

// 2. Lấy nhật ký ăn uống theo ngày cụ thể
export const getDailyMealLogs = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const targetDate = req.query.date ? new Date(req.query.date) : new Date();

        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const logs = await MealLog.find({
            userId,
            consumedAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ consumedAt: 1 });

        let dailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        logs.forEach(log => {
            if (log.nutritionSnapshot) {
                dailyTotals.calories += log.nutritionSnapshot.calories || 0;
                dailyTotals.protein += log.nutritionSnapshot.protein || 0;
                dailyTotals.carbs += log.nutritionSnapshot.carbs || 0;
                dailyTotals.fat += log.nutritionSnapshot.fat || 0;
            }
        });

        dailyTotals = {
            calories: Math.round(dailyTotals.calories),
            protein: parseFloat(dailyTotals.protein.toFixed(1)),
            carbs: parseFloat(dailyTotals.carbs.toFixed(1)),
            fat: parseFloat(dailyTotals.fat.toFixed(1))
        };

        return res.status(200).json({
            success: true,
            date: startOfDay,
            logs,
            dailyTotals
        });
    } catch (error) {
        console.error("Lỗi lấy nhật ký hàng ngày:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// 3. Xóa một bản ghi nhật ký
export const deleteMealLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id || req.user.id;

        const deletedLog = await MealLog.findOneAndDelete({ _id: id, userId });

        if (!deletedLog) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi hoặc không có quyền xóa" });
        }

        return res.status(200).json({ success: true, message: "Đã xóa nhật ký bữa ăn" });
    } catch (error) {
        console.error("Lỗi xóa nhật ký:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
    }
};

// 4. Lấy TOÀN BỘ nhật ký ăn uống của User
export const getMyMealLogs = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const myLogs = await MealLog.find({ userId: userId }).sort({ consumedAt: -1 });

        return res.status(200).json({ success: true, data: myLogs });
    } catch (error) {
        console.error("Lỗi khi gọi getMyMealLogs:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống khi lấy tổng nhật ký" });
    }
};

// ==========================================
// CÁC API DÀNH RIÊNG CHO QUẢN TRỊ VIÊN (ADMIN)
// ==========================================

// 5. Lấy toàn bộ nhật ký hệ thống (Admin)
export const getAllMealLogsForAdmin = async (req, res) => {
    try {
        const logs = await MealLog.find()
            .populate('userId', 'name displayName email')
            .sort({ consumedAt: -1 }); 
            
        return res.status(200).json(logs); 
    } catch (error) {
        console.error("Lỗi lấy toàn bộ nhật ký cho Admin:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 6. Hàm xóa đặc quyền cho Admin
export const adminDeleteMealLog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLog = await MealLog.findByIdAndDelete(id);

        if (!deletedLog) {
            return res.status(404).json({ message: "Không tìm thấy bản ghi nhật ký" });
        }

        return res.status(200).json({ message: "Admin đã xóa bản ghi nhật ký thành công" });
    } catch (error) {
        console.error("Lỗi Admin xóa nhật ký:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};