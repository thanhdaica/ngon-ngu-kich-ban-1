import mongoose from 'mongoose';
import Book from "../model/Book.js"
import Category from '../model/Category.js';
class BooksController {
    // Danh sách + tìm kiếm nâng cao + phân trang + sắp xếp
    async index(req, res) {
        try {
            const {
                name,
                author,
                category,
                page = 1,
                limit = 10,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;
            
            //Tạo bộ lọc tìm kiếm filter
            const filter = {};
            if (name) filter.name = { $regex: name, $options: 'i' };
            if (author) filter.author = { $regex: author, $options: 'i' };
            if (category) filter.categories = { $in: [category] };

            const books = await Book.find(filter)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });

            res.json(books);    
        } catch (error) {
            res.status(500).json({ message: "Lỗi lấy danh sách sách", error });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params; // Lấy ID từ URL
            
            // Kiểm tra tính hợp lệ của ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID không hợp lệ" });
            }

            // Tìm 1 cuốn sách bằng ID
            const book = await Book.findById(id)
                                   .populate('categories', 'name'); // Lấy luôn tên thể loại

            if (!book) {
                return res.status(404).json({ message: "Không tìm thấy sách" });
            }

            res.json(book);
        } catch (error) {
            res.status(500).json({ message: "Lỗi xem chi tiết sách", error: error.message });
        }
    }

    // Thêm sách mới
    async store(req, res) {
        try {
            console.log('📥 Dữ liệu nhận được:', req.body);
            const newBook = await Book.create(req.body);
            console.log('✅ Tạo sách thành công:', newBook);
            res.status(201).json({
                success: true,
                message: "Thêm sách thành công",
                data: newBook
            });
        } catch (error) {
            console.error('❌ Lỗi khi thêm sách:', error);
            res.status(400).json({ 
                success: false,
                message: "Lỗi thêm sách mới", 
                error: error.message,
                details: error.errors || error
            });
        }
    }

    // Cập nhật thông tin sách
    async update(req, res) {
        try {
            const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
            res.json(book);
        } catch (error) {
            res.status(400).json({ message: "Lỗi cập nhật sách", error });
        }
    }

    // Xoá sách
    async delete(req, res) {
        try {
            const book = await Book.findByIdAndDelete(req.params.id);
            if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
            res.status(204).send(); // Không trả dữ liệu
        } catch (error) {
            res.status(500).json({ message: "Lỗi xoá sách", error });
        }
    }

    // lấy sách theo thể loại 
    async getBooksByCategory(req, res) {
        try {
            const { id } = req.params; // Lấy category ID từ URL
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID thể loại không hợp lệ" });
            }

            // 1. Chuyển 'id' (String) thành 'ObjectId'
            const categoryObjectId = new mongoose.Types.ObjectId(id);

            // 2. Dùng 'categoryObjectId' (dạng Object) để tìm trong mảng
            // Tìm tất cả sách có chứa ID này trong mảng 'categories'
            const books = await Book.find({ categories: categoryObjectId });

            // Tìm thông tin của category để lấy tên
            const category = await Category.findById(id);
    
            if (!category) {
                return res.status(404).json({ message: 'Không tìm thấy thể loại này.' });
            }
    
            // Trả về dữ liệu đúng như frontend (CategoryDetailPage) mong đợi
            res.status(200).json({
                categoryName: category.name,
                products: books // 'products' khớp với code frontend
            });
    
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server khi lấy sách theo thể loại', error: error.message });
        }
    }

}

export default BooksController;
