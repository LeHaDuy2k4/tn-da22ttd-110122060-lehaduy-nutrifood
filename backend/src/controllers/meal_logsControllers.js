import MealLog from "../models/Meal_log.js";

// 1. Thêm nhật ký bữa ăn
export const createMealLog = async (req, res) => {
    try {
        const { mealId, foodName, mealType, servingsConsumed, consumedAt, notes } = req.body;
        const userId = req.user._id;

        const newLog = new MealLog({
            userId,
            mealId,
            foodName,
            mealType,
            servingsConsumed,
            consumedAt: consumedAt || Date.now(),
            notes
        });

        // Trigger tự động tính Calo sẽ chạy ở bước này
        const savedLog = await newLog.save();

        res.status(201).json({
            message: "Đã ghi nhận bữa ăn",
            log: savedLog
        });
    } catch (error) {
        console.error("Lỗi thêm nhật ký bữa ăn:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 2. Lấy nhật ký ăn uống theo ngày cụ thể (Báo cáo hàng ngày)
export const getDailyMealLogs = async (req, res) => {
    try {
        const userId = req.user._id;
        const targetDate = req.query.date ? new Date(req.query.date) : new Date();

        // Tạo khoảng thời gian từ 00:00:00 đến 23:59:59 của ngày đó
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const logs = await MealLog.find({
            userId,
            consumedAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ consumedAt: 1 });

        // Tính tổng dinh dưỡng trong ngày để Frontend vẽ biểu đồ
        let dailyTotals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        logs.forEach(log => {
            // Kiểm tra an toàn trước khi cộng dồn để tránh lỗi nếu nutritionSnapshot bị thiếu
            if (log.nutritionSnapshot) {
                dailyTotals.calories += log.nutritionSnapshot.calories || 0;
                dailyTotals.protein += log.nutritionSnapshot.protein || 0;
                dailyTotals.carbs += log.nutritionSnapshot.carbs || 0;
                dailyTotals.fat += log.nutritionSnapshot.fat || 0;
            }
        });

        res.status(200).json({
            date: startOfDay,
            logs,
            dailyTotals
        });
    } catch (error) {
        console.error("Lỗi lấy nhật ký hàng ngày:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 3. Xóa một bản ghi nhật ký (Trường hợp nhập nhầm của User)
export const deleteMealLog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Đảm bảo user chỉ được xóa nhật ký của chính mình
        const deletedLog = await MealLog.findOneAndDelete({ _id: id, userId });

        if (!deletedLog) {
            return res.status(404).json({ message: "Không tìm thấy bản ghi hoặc không có quyền xóa" });
        }

        res.status(200).json({ message: "Đã xóa nhật ký bữa ăn" });
    } catch (error) {
        console.error("Lỗi xóa nhật ký:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// ==========================================
// CÁC API DÀNH RIÊNG CHO QUẢN TRỊ VIÊN (ADMIN)
// ==========================================

// 4. Lấy toàn bộ nhật ký hệ thống (Admin)
export const getAllMealLogsForAdmin = async (req, res) => {
    try {
        // populate('userId') để kéo theo thông tin name, email của user hiển thị trên bảng
        const logs = await MealLog.find()
            .populate('userId', 'name email')
            .sort({ consumedAt: -1 }); // Bản ghi mới nhất hiển thị trên cùng
            
        res.status(200).json(logs);
    } catch (error) {
        console.error("Lỗi lấy toàn bộ nhật ký cho Admin:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 5. Hàm xóa đặc quyền cho Admin (Xóa không cần kiểm tra userId của người tạo)
export const adminDeleteMealLog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLog = await MealLog.findByIdAndDelete(id);

        if (!deletedLog) {
            return res.status(404).json({ message: "Không tìm thấy bản ghi nhật ký" });
        }

        res.status(200).json({ message: "Admin đã xóa bản ghi nhật ký thành công" });
    } catch (error) {
        console.error("Lỗi Admin xóa nhật ký:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};