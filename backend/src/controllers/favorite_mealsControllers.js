import FavoriteMeal from "../models/Favorite_meal.js";

// ==========================================
// NHÓM 1: CÁC API DÀNH CHO NGƯỜI DÙNG (USER)
// ==========================================

// 1. Thả tim / Hủy thả tim món ăn (Toggle)
export const toggleFavorite = async (req, res) => {
    try {
        const { mealId } = req.body;
        const userId = req.user._id; // Lấy từ token đăng nhập

        // Kiểm tra xem đã thả tim chưa
        const existingFavorite = await FavoriteMeal.findOne({ userId, mealId });

        if (existingFavorite) {
            // Nếu đã có -> Xóa (Hủy thả tim)
            await FavoriteMeal.findByIdAndDelete(existingFavorite._id);
            return res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích", isFavorited: false });
        } else {
            // Nếu chưa có -> Thêm mới
            const newFavorite = new FavoriteMeal({ userId, mealId });
            await newFavorite.save();
            return res.status(201).json({ message: "Đã thêm vào danh sách yêu thích", isFavorited: true });
        }
    } catch (error) {
        console.error("Lỗi toggle favorite:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 2. Lấy danh sách món ăn yêu thích của User
export const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Lấy danh sách và populate luôn thông tin món ăn (mealId)
        const favorites = await FavoriteMeal.find({ userId })
            .populate({
                path: 'mealId',
                select: 'name imageUrl prepTime cookTime totalNutrition totalEstimatedCost'
            })
            .sort({ createdAt: -1 });

        res.status(200).json(favorites);
    } catch (error) {
        console.error("Lỗi lấy danh sách yêu thích:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 3. Kiểm tra xem 1 món cụ thể có đang được thả tim không (Dành cho UI hiển thị trái tim đỏ/trắng)
export const checkIsFavorite = async (req, res) => {
    try {
        const { mealId } = req.params;
        const userId = req.user._id;

        const exists = await FavoriteMeal.findOne({ userId, mealId });
        res.status(200).json({ isFavorited: !!exists });
    } catch (error) {
        console.error("Lỗi kiểm tra trạng thái yêu thích:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};


// ==========================================
// NHÓM 2: CÁC API DÀNH RIÊNG CHO QUẢN TRỊ VIÊN (ADMIN)
// ==========================================

// 4. Lấy toàn bộ danh sách yêu thích của toàn hệ thống (Admin)
export const getAllFavoritesForAdmin = async (req, res) => {
    try {
        // Kéo theo (populate) cả thông tin Người dùng và Món ăn để hiển thị lên bảng Dashboard
        const favorites = await FavoriteMeal.find()
            .populate('userId', 'name email')
            .populate('mealId', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(favorites);
    } catch (error) {
        console.error("Lỗi lấy toàn bộ lượt yêu thích cho Admin:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 5. Admin xóa (gỡ) lượt thả tim bất kỳ
export const adminDeleteFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFav = await FavoriteMeal.findByIdAndDelete(id);

        if (!deletedFav) {
            return res.status(404).json({ message: "Không tìm thấy bản ghi yêu thích" });
        }

        res.status(200).json({ message: "Admin đã xóa bản ghi yêu thích thành công" });
    } catch (error) {
        console.error("Lỗi Admin xóa lượt yêu thích:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};