import cron from 'node-cron';
import MealLog from '../models/Meal_log.js'; 
import Notification from '../models/Notification.js';

export const startCronJobs = () => {
    // ⏰ Lên lịch quét vào đúng 06:00 Sáng mỗi ngày
    cron.schedule('0 6 * * *', async () => {
        console.log("🚀 [CRON JOB] Bắt đầu quét lịch ăn uống dự kiến ngày hôm nay...");
        
        try {
            // Xác định từ 00:00:00 đến 23:59:59 của ngày hôm nay
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // Chỉ lấy những món ăn thuộc HÔM NAY và có note là "Dự kiến ăn"
            const todaysLogs = await MealLog.find({
                consumedAt: { $gte: startOfDay, $lte: endOfDay },
                notes: "Dự kiến ăn (Từ Lộ trình AI)"
            });

            if (todaysLogs.length === 0) {
                console.log("👉 [CRON JOB] Hôm nay không có thực đơn dự kiến nào.");
                return;
            }

            // Gom nhóm các món ăn theo từng userId để tránh spam thông báo
            const userMealsMap = {};
            todaysLogs.forEach(log => {
                if (log.userId && log.foodName) {
                    const uId = log.userId.toString();
                    if (!userMealsMap[uId]) userMealsMap[uId] = [];
                    userMealsMap[uId].push(log.foodName);
                }
            });

            // Tạo 1 thông báo duy nhất cho từng người dùng
            let notificationCount = 0;
            for (const userId in userMealsMap) {
                const mealsList = userMealsMap[userId].join(', ');

                await Notification.create({
                    userId: userId,
                    type: 'REMINDER', 
                    title: `🔔 Lộ trình thực đơn hôm nay đã sẵn sàng!`,
                    content: `Hôm nay bạn dự kiến ăn: ${mealsList}. Đừng quên ăn đúng giờ để đạt mục tiêu sức khỏe nhé!`
                });
                notificationCount++;
                
                // Cập nhật lại note để đánh dấu là đã thông báo (tránh bị gửi trùng nếu server khởi động lại)
                await MealLog.updateMany(
                    { userId: userId, consumedAt: { $gte: startOfDay, $lte: endOfDay }, notes: "Dự kiến ăn (Từ Lộ trình AI)" },
                    { $set: { notes: "Đã thông báo (Từ Lộ trình AI)" } }
                );
            }
            
            console.log(`✅ [CRON JOB] Đã phát thành công ${notificationCount} thông báo gom nhóm!`);
        } catch (error) {
            console.error("❌ [CRON JOB] Lỗi khi quét tự động:", error.message);
        }
    });
};