import cron from 'node-cron';
import MealLog from '../models/Meal_log.js'; 
import Notification from '../models/Notification.js';

export const startCronJobs = () => {
    // ⏰ Lên lịch quét vào đúng 06:00 Sáng mỗi ngày
    cron.schedule('0 6 * * *', async () => {
        console.log("🚀 [CRON JOB] Bắt đầu quét lịch ăn uống ngày hôm nay...");
        
        try {
            // Xác định từ 00:00:00 đến 23:59:59 của ngày hôm nay
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // Truy vấn lấy tất cả nhật ký ăn uống ĐƯỢC LÊN LỊCH VÀO HÔM NAY
            const todaysLogs = await MealLog.find({
                consumedAt: { $gte: startOfDay, $lte: endOfDay }
            });

            if (todaysLogs.length === 0) {
                console.log("👉 [CRON JOB] Hôm nay không có người dùng nào có lịch ăn uống.");
                return;
            }

            // Tạo thông báo nhắc nhở cho từng món ăn
            for (const log of todaysLogs) {
                // Đảm bảo có userId và tên món ăn
                if (log.userId && log.foodName) {
                    await Notification.create({
                        userId: log.userId,
                        type: 'REMINDER', 
                        title: `🍽️ Nhắc nhở ăn ${log.mealType}`,
                        content: `Hôm nay bạn có lịch ăn món "${log.foodName}". Đừng quên ghi nhận vào nhật ký nhé!`
                    });
                }
            }
            
            console.log(`✅ [CRON JOB] Đã phát thành công ${todaysLogs.length} thông báo nhắc nhở!`);
        } catch (error) {
            console.error("❌ [CRON JOB] Lỗi khi quét tự động:", error.message);
        }
    });
};