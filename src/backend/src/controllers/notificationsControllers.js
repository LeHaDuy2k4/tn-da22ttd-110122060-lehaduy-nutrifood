import Notification from "../models/Notification.js";

// 1. Lấy danh sách thông báo của User đang đăng nhập
export const getUserNotifications = async (req, res) => {
    try {
        // Lấy thông báo, sắp xếp mới nhất lên đầu dựa trên thời gian tạo
        const notifications = await Notification.find({ userId: req.user._id })
                                              .sort({ createdAt: -1 });
        
        // Đếm số thông báo chưa đọc để hiển thị số lượng trên giao diện người dùng
        const unreadCount = notifications.filter(n => !n.isRead).length;

        return res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        console.error("Lỗi khi tải thông báo:", error.message);
        return res.status(500).json({ message: "Lỗi khi tải danh sách thông báo" });
    }
};

// 2. Đánh dấu 1 thông báo cụ thể là đã đọc
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Thông báo không tồn tại hoặc không thuộc quyền sở hữu của bạn" });
        }

        return res.status(200).json(notification);
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đọc:", error.message);
        return res.status(500).json({ message: "Lỗi cập nhật trạng thái đã đọc" });
    }
};

// 3. Đánh dấu TẤT CẢ thông báo là đã đọc (UX Bonus)
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );
        return res.status(200).json({ message: "Đã đánh dấu đọc tất cả thông báo thành công" });
    } catch (error) {
        console.error("Lỗi khi đánh dấu đọc tất cả:", error.message);
        return res.status(500).json({ message: "Lỗi cập nhật tất cả trạng thái thông báo" });
    }
};

// 4. Xóa một thông báo cụ thể
export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const notifId = req.params.id;

        const deletedNotif = await Notification.findOneAndDelete({ _id: notifId, userId: userId });

        if (!deletedNotif) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông báo." });
        }

        return res.status(200).json({ success: true, message: "Đã xóa thông báo." });
    } catch (error) {
        console.error("Lỗi xóa thông báo:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống." });
    }
};

// 5. Tạo thông báo mới độc lập (Hàm mới mở rộng - Không phụ thuộc vào luồng AI)
export const createNotification = async (req, res) => {
    try {
        const { type, title, content } = req.body;

        // Kiểm tra các trường dữ liệu bắt buộc đầu vào
        if (!title || !content) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin tiêu đề và nội dung thông báo" });
        }

        // Ràng buộc giá trị phân loại dựa trên enum sẵn có trong cơ sở dữ liệu để chống lỗi Validation
        const validTypes = ['REMINDER', 'SYSTEM', 'AI_COMPLETED'];
        const notificationType = validTypes.includes(type) ? type : 'SYSTEM';

        // Khởi tạo dòng dữ liệu thông báo mới và liên kết trực tiếp với tài khoản người dùng
        const newNotification = await Notification.create({
            userId: req.user._id,
            type: notificationType,
            title: title,
            content: content
        });

        return res.status(201).json({ 
            message: "Đã phát hành thông báo hệ thống thành công!", 
            notification: newNotification 
        });
    } catch (error) {
        console.error("Lỗi khi tạo thông báo độc lập:", error.message);
        return res.status(500).json({ message: "Lỗi hệ thống khi khởi tạo thông báo độc lập" });
    }
};

// Hàm xóa 1 thông báo
