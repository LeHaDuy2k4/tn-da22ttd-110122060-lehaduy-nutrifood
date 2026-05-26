import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 

// Import cấu hình cơ sở dữ liệu
import { connectDB } from './config/db.js';

// Import các file định tuyến (Routes)
import authRoute from './routes/authsRouters.js';
import userRoute from './routes/usersRouters.js';

import categoryRoute from './routes/categoriesRouters.js';
import ingredientRoute from './routes/ingredientsRouters.js';
import mealRoute from './routes/mealsRouters.js';

// 🎯 BỔ SUNG: Import 2 Route cho tính năng Cá nhân hóa (Yêu thích & Nhật ký)
import favoriteRoute from './routes/favorite_mealsRouters.js';
import mealLogRoute from './routes/meal_logsRouters.js';

// Import Middleware xác thực và phân quyền
import { protectedRoute, isAdmin } from './middlewares/authMiddleware.js';

// Cấu hình biến môi trường
dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

// ==========================================
// CẤU HÌNH CÁC MIDDLEWARES HỆ THỐNG
// ==========================================

// 1. Cấu hình CORS (Mở cửa kết nối an toàn cho Frontend React Vite)
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,               // BẮT BUỘC: Cho phép Frontend gửi kèm Token/Cookie sang
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Ép kiểu dữ liệu request body sang JSON
app.use(express.json());

// 3. Đọc dữ liệu Cookie từ request gửi lên
app.use(cookieParser());


// ==========================================
// ĐỊNH TUYẾN CÁC API (ROUTES)
// ==========================================

// 🎯 Nhóm 1: Các Route công khai hoàn toàn (Không cần đăng nhập)
// Bao gồm: Đăng ký, Đăng nhập, Đăng xuất
app.use("/api/auth", authRoute);

// 🎯 Nhóm 2: Nhóm dữ liệu hệ thống (Từ điển ẩm thực)
// Cho phép Router tự quyết định bên trong (Ví dụ: GET thì công khai, POST/PUT/DELETE thì khóa)
app.use("/api/categories", categoryRoute);
app.use("/api/ingredients", ingredientRoute);
app.use("/api/meals", mealRoute);

// 🎯 Nhóm 3: Nhóm Route cá nhân hóa (Bắt buộc đăng nhập mới được thao tác)
// Ví dụ: Xem thông tin cá nhân, sửa thông tin cá nhân
app.use("/api/users", protectedRoute, userRoute);

// Mount 2 Router mới vào hệ thống (Bên trong 2 file router này đã gắn sẵn Middleware xác thực)
app.use("/api/favorites", favoriteRoute);
app.use("/api/meal-logs", mealLogRoute);


// ==========================================
// KHỞI CHẠY HỆ THỐNG CƠ SỞ DỮ LIỆU & SERVER
// ==========================================
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server NutriFood đang chạy trên cổng ${PORT}`);
    });
}).catch((error) => {
    console.error("❌ Không thể kết nối cơ sở dữ liệu. Server không khởi động.", error);
});