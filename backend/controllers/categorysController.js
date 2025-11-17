import Category from "../model/Category.js";

class CategorysController {
    // Danh sách categories
    async index(req, res) {
        try {
            const categories = await Category.find().populate('books');
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: "Lỗi lấy danh sách thể loại", error: error.message });
        }
    }

    // Thêm category mới
    async store(req, res) {
        try {
            const newCategory = await Category.create(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(400).json({ message: "Lỗi thêm thể loại mới", error: error.message });
        }
    }

    // Cập nhật thông tin category
    async update(req, res) {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!category) return res.status(404).json({ message: "Không tìm thấy thể loại" });
            res.json(category);
        } catch (error) {
            res.status(400).json({ message: "Lỗi cập nhật thể loại", error: error.message });
        }
    }

    // Xoá category
    async delete(req, res) {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);
            if (!category) return res.status(404).json({ message: "Không tìm thấy thể loại" });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Lỗi xoá thể loại", error: error.message });
        }
    }
}

export default CategorysController;
