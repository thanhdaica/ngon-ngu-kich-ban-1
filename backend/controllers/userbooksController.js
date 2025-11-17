import UserBook from "../model/UserBook.js";

class UserBooksController {
    // Danh sách userbooks
    async index(req, res) {
        try {
            const userBooks = await UserBook.find()
                .populate('userId')
                .populate('bookId');
            res.json(userBooks);
        } catch (error) {
            res.status(500).json({ message: "Lỗi lấy danh sách userbook", error: error.message });
        }
    }

    // Thêm userbook mới
    async store(req, res) {
        try {
            const newUserBook = await UserBook.create(req.body);
            const populatedUserBook = await UserBook.findById(newUserBook._id)
                .populate('userId')
                .populate('bookId');
            res.status(201).json(populatedUserBook);
        } catch (error) {
            res.status(400).json({ message: "Lỗi thêm userbook mới", error: error.message });
        }
    }

    // Cập nhật thông tin userbook
    async update(req, res) {
        try {
            const userBook = await UserBook.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!userBook) return res.status(404).json({ message: "Không tìm thấy userbook" });
            
            const populatedUserBook = await UserBook.findById(userBook._id)
                .populate('userId')
                .populate('bookId');
            res.json(populatedUserBook);
        } catch (error) {
            res.status(400).json({ message: "Lỗi cập nhật userbook", error: error.message });
        }
    }

    // Xoá userbook
    async delete(req, res) {
        try {
            const userBook = await UserBook.findByIdAndDelete(req.params.id);
            if (!userBook) return res.status(404).json({ message: "Không tìm thấy userbook" });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Lỗi xoá userbook", error: error.message });
        }
    }
}

export default UserBooksController;
