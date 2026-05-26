import express from 'express';
import { 
    getAllMeals, 
    getMealById, 
    createMeal, 
    updateMeal, 
    deleteMeal,
    importMeals
} from '../controllers/mealsControllers.js';
import { isAdmin, protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router(); 

// Xem danh sách món ăn & chi tiết món ăn (Public)
router.get("/", getAllMeals);
router.get("/:id", getMealById);

// Thêm, Sửa, Xóa món ăn (Yêu cầu Admin)
router.post("/import", protectedRoute, isAdmin, importMeals);
router.post("/", protectedRoute, isAdmin, createMeal);
router.put("/:id", protectedRoute, isAdmin, updateMeal);
router.delete("/:id", protectedRoute, isAdmin, deleteMeal);

export default router;