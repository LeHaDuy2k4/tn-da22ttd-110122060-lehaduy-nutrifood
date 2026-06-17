import MealPlan from "../models/MealPlan.js";
import Meal from "../models/Meal.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js"; // 🎯 Đã Import Trạm Thông Báo

/**
 * 🎯 KHỞI TẠO LỘ TRÌNH THỰC ĐƠN TUẦN (Tích hợp AI & Cơ chế dự phòng Fallback)
 * POST /api/meal-plans/generate
 */
export const generateMealPlan = async (req, res) => {
  try {
    // 1. SỬA LỖI LẤY ID: Lấy linh hoạt cả _id và id tùy theo cấu trúc Token
    const userId = req.user?._id || req.user?.id; 
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Lỗi xác thực: Không tìm thấy ID người dùng trong Token." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông tin hồ sơ người dùng." });
    }

    if (user.height === 0 || user.weight === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Vui lòng hoàn thành thiết lập hồ sơ thể chất (Chiều cao, cân nặng) trước khi khởi tạo lộ trình." 
      });
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    let dailyMenus = [];
    let isGeneratedByFallback = false;
    const targetCalories = user.bmi > 25 ? 1800 : 2200; 

    try {
      // BƯỚC XỬ LÝ CỦA AI SẼ NẰM Ở ĐÂY
      // Giả lập API Gemini quá tải để test luồng Fallback
      throw new Error("Gemini API Gateway Timeout - Lỗi 503");

      // NẾU AI THÀNH CÔNG, BẠN SẼ GỌI THÔNG BÁO Ở ĐÂY:
      /*
      await Notification.create({
          userId: userId,
          type: 'SYSTEM', 
          title: 'Thực đơn của bạn đã sẵn sàng! 🎉',
          content: 'Trợ lý AI đã thiết kế xong lộ trình ăn uống tiết kiệm và tối ưu cho bạn.'
      });
      */

    } catch (aiError) {
      isGeneratedByFallback = true;
      console.warn(`[SYSTEM ALERT] Kích hoạt cơ chế thực đơn dự phòng nội bộ: ${aiError.message}`);

      // Lấy toàn bộ món ăn khả dụng
      const availableMeals = await Meal.find({ isActive: true });
      if (!availableMeals || availableMeals.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Cơ sở dữ liệu món ăn đang trống, không thể cấu hình thực đơn dự phòng." 
        });
      }

      // 🎯 Lọc các món ăn bình dân (≤ 50.000 VND) cho phương án dự phòng
      const budgetMeals = availableMeals.filter(meal => (meal.totalEstimatedCost || 0) <= 50000);
      const sourceMeals = budgetMeals.length >= 4 ? budgetMeals : availableMeals;

      const mealTypes = ['Bữa sáng', 'Bữa trưa', 'Bữa tối', 'Bữa phụ'];

      for (let i = 1; i <= 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (i - 1));

        let dayMeals = [];
        mealTypes.forEach(type => {
          const randomMeal = sourceMeals[Math.floor(Math.random() * sourceMeals.length)];
          dayMeals.push({
            mealType: type,
            mealId: randomMeal._id,
            isLogged: false 
          });
        });

        dailyMenus.push({
          dayNumber: i,
          date: currentDate,
          meals: dayMeals
        });
      }

      // 🎯 MẮT XÍCH QUAN TRỌNG: Gọi Trạm Thông Báo để rung chuông trên Frontend
      try {
        await Notification.create({
            userId: userId,
            type: 'SYSTEM',
            title: 'Gợi ý thực đơn ngẫu nhiên 🍲',
            content: 'Hệ thống AI hiện đang bận (Lỗi 503). NutriFood đã tự động kích hoạt lộ trình dự phòng gồm các món bình dân để đảm bảo tiến độ của bạn!'
        });
        console.log("👉 Đã lưu thông báo dự phòng 503 vào MongoDB thành công!");
      } catch (notifErr) {
        console.error("❌ Lỗi không gọi được module thông báo:", notifErr.message);
      }
    }

    // Xóa lộ trình cũ trong tuần hiện tại
    await MealPlan.deleteMany({
      userId,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    // Tạo lộ trình mới
    const newMealPlan = new MealPlan({
      userId,
      startDate,
      endDate,
      dailyMenus,
      totalDailyCalories: targetCalories,
      isGeneratedByFallback
    });

    await newMealPlan.save(); 

    return res.status(201).json({
      success: true,
      message: isGeneratedByFallback
        ? "Kiến tạo lộ trình dinh dưỡng thành công qua cơ chế dự phòng."
        : "Kiến tạo lộ trình dinh dưỡng thông minh bằng Trí tuệ nhân tạo AI.",
      data: newMealPlan
    });

  } catch (error) {
    console.error("🔥 LỖI NGHIÊM TRỌNG TẠI MEALPLAN CONTROLLER:", error.message);
    console.error(error.stack); 
    return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ trong quá trình xử lý dữ liệu.", error: error.message });
  }
};

/**
 * 🎯 TRUY XUẤT LỘ TRÌNH THỰC ĐƠN TUẦN HIỆN TẠI
 * GET /api/meal-plans/current
 */
export const getCurrentMealPlan = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const today = new Date();

    const activePlan = await MealPlan.findOne({
      userId,
      startDate: { $lte: today },
      endDate: { $gte: today }
    }).populate("dailyMenus.meals.mealId"); 

    if (!activePlan) {
      return res.status(404).json({
        success: false,
        message: "Hệ thống chưa tìm thấy lộ trình thực đơn tuần này."
      });
    }

    return res.status(200).json({ success: true, data: activePlan });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi kết nối cơ sở dữ liệu." });
  }
};