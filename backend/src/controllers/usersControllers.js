import User from "../models/User.js";

// 1. Lấy thông tin cá nhân
export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Lỗi khi gọi authMe', error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 2. Lấy tất cả người dùng (Dành cho Admin)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-hashedPassword').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Lỗi khi gọi getAllUsers", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 3. Cập nhật hồ sơ người dùng
export const updateUserProfile = async (req, res) => {
    try {
        const { displayName, height, weight, healthGoal, budgetPreference, interests } = req.body;
        
        // Dùng req.user._id từ middleware bảo mật
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        if (displayName) user.displayName = displayName;
        if (height !== undefined) user.height = height;
        if (weight !== undefined) user.weight = weight;
        if (healthGoal) user.healthGoal = healthGoal;
        if (budgetPreference !== undefined) user.budgetPreference = budgetPreference;
        if (interests) user.interests = interests;

        const updatedUser = await user.save();

        const userObject = updatedUser.toObject();
        delete userObject.hashedPassword;

        res.status(200).json({
            message: "Cập nhật hồ sơ thành công",
            user: userObject
        });
    } catch (error) {
        console.error("Lỗi khi gọi updateUserProfile", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 4. Thay đổi quyền người dùng (Dành cho Admin - CÓ BẢO MẬT)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        // 🛡️ BẢO MẬT: Admin không được tự sửa quyền của chính mình
        if (id === req.user._id.toString()) {
            return res.status(403).json({ message: "Bạn không thể tự thay đổi quyền của chính mình!" });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select('-hashedPassword');

        if (!updatedUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        res.status(200).json({
            message: "Cập nhật quyền hạn thành công",
            user: updatedUser
        });
    } catch (error) {
        console.error("Lỗi khi gọi updateUserRole", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 5. Xóa người dùng (Dành cho Admin - CÓ BẢO MẬT)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 🛡️ BẢO MẬT: Admin không được tự xóa tài khoản của chính mình
        if (id === req.user._id.toString()) {
            return res.status(403).json({ message: "Bạn không thể xóa chính tài khoản của mình!" });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        res.status(200).json({
            message: "Xóa tài khoản thành công",
            userId: id
        });
    } catch (error) {
        console.error("Lỗi khi gọi deleteUser", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};