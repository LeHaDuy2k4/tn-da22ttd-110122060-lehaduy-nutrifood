import Meal from "../models/Meal.js";

// 1. Lấy tất cả món ăn (Có kèm thông tin chi tiết từ Category và Ingredient)
export const getAllMeals = async (req, res) => {
    try {
        const meals = await Meal.find()
            .populate('categoryIds', 'name slug type') // Dịch ID danh mục thành tên, slug, type
            .populate('ingredients.ingredientId', 'name baseUnit referencePrice') // Dịch ID nguyên liệu
            .sort({ createdAt: -1 });

        res.status(200).json(meals);
    } catch (error) {
        console.error("Lỗi khi gọi getAllMeals:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 2. Lấy chi tiết 1 món ăn cụ thể (Dành cho trang chi tiết món)
export const getMealById = async (req, res) => {
    try {
        const meal = await Meal.findById(req.params.id)
            .populate('categoryIds', 'name slug type')
            .populate('ingredients.ingredientId', 'name baseUnit nutritionalValue referencePrice');

        if (!meal) {
            return res.status(404).json({ message: "Món ăn không tồn tại" });
        }

        res.status(200).json(meal);
    } catch (error) {
        console.error("Lỗi khi gọi getMealById:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 3. Tạo món ăn mới
export const createMeal = async (req, res) => {
    try {
        const { 
            name, description, categoryIds, ingredients, 
            instructions, imageUrl, prepTime, cookTime, servings, isActive 
        } = req.body;
        
        const meal = new Meal({ 
            name, description, categoryIds, ingredients, 
            instructions, imageUrl, prepTime, cookTime, servings, isActive 
        });

        // 🎯 LƯU Ý: Lệnh .save() này sẽ tự động gọi hook pre('save') 
        // để tự cộng dồn Calo, Protein, Carbs, Fat và Tiền!
        const newMeal = await meal.save();
        
        res.status(201).json({
            message: "Thêm món ăn thành công",
            meal: newMeal
        });
    } catch (error) {
        console.error("Lỗi khi gọi createMeal:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 4. Cập nhật món ăn
export const updateMeal = async (req, res) => {
    try {
        const { 
            name, description, categoryIds, ingredients, 
            instructions, imageUrl, prepTime, cookTime, servings, isActive 
        } = req.body;
        
        // Lấy Document thực sự
        const meal = await Meal.findById(req.params.id);

        if (!meal) {
            return res.status(404).json({ message: "Món ăn không tồn tại" });
        }

        // Cập nhật giá trị
        if (name) meal.name = name;
        if (description !== undefined) meal.description = description;
        if (categoryIds) meal.categoryIds = categoryIds;
        if (ingredients) meal.ingredients = ingredients;
        if (instructions) meal.instructions = instructions;
        if (imageUrl !== undefined) meal.imageUrl = imageUrl;
        if (prepTime !== undefined) meal.prepTime = prepTime;
        if (cookTime !== undefined) meal.cookTime = cookTime;
        if (servings !== undefined) meal.servings = servings;
        if (isActive !== undefined) meal.isActive = isActive;

        // 🎯 Lệnh .save() này cực kỳ quan trọng:
        // Nếu Frontend thay đổi nguyên liệu (ingredients), nó sẽ tự động chạy lại hook tính toán dinh dưỡng!
        const updatedMeal = await meal.save();

        res.status(200).json({ 
            message: "Cập nhật món ăn thành công", 
            meal: updatedMeal 
        });
    } catch (error) {
        console.error("Lỗi khi gọi updateMeal:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 5. Xóa món ăn
export const deleteMeal = async (req, res) => {
    try {
        const deletedMeal = await Meal.findByIdAndDelete(req.params.id);

        if (!deletedMeal) {
            return res.status(404).json({ message: "Món ăn không tồn tại" });
        }

        res.status(200).json({ 
            message: "Xóa món ăn thành công", 
            meal: deletedMeal 
        });
    } catch (error) {
        console.error("Lỗi khi gọi deleteMeal:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// 🎯 BỔ SUNG: 6. Import hàng loạt món ăn (Từ mảng JSON)
export const importMeals = async (req, res) => {
    try {
        const mealsData = req.body;

        // Kiểm tra xem dữ liệu gửi lên có phải là một mảng không
        if (!Array.isArray(mealsData) || mealsData.length === 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ. Vui lòng gửi một mảng JSON." });
        }

        const importedMeals = [];
        let skippedCount = 0;

        for (const item of mealsData) {
            try {
                // Tránh import trùng lặp tên món ăn
                const existing = await Meal.findOne({ name: item.name });
                
                if (!existing) {
                    const newMeal = new Meal({
                        name: item.name,
                        description: item.description,
                        categoryIds: item.categoryIds,
                        ingredients: item.ingredients,
                        instructions: item.instructions,
                        imageUrl: item.imageUrl,
                        prepTime: item.prepTime,
                        cookTime: item.cookTime,
                        servings: item.servings,
                        isActive: item.isActive !== undefined ? item.isActive : true
                    });
                    
                    // .save() để chạy trigger tính toán calo và giá tiền tự động
                    await newMeal.save();
                    importedMeals.push(newMeal);
                } else {
                    skippedCount++; 
                }
            } catch (err) {
                console.error(`Lỗi khi import món ăn ${item.name}:`, err);
                skippedCount++;
            }
        }

        res.status(201).json({
            message: `Import hoàn tất! Đã thêm ${importedMeals.length} món ăn. Bỏ qua/Lỗi ${skippedCount} món.`,
            importedCount: importedMeals.length,
            skippedCount: skippedCount,
            meals: importedMeals 
        });

    } catch (error) {
        console.error("Lỗi khi gọi importMeals:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi import dữ liệu." });
    }
};