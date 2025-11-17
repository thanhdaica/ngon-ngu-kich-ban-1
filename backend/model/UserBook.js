import mongoose from 'mongoose';

const { Schema } = mongoose; // Khai báo Schema từ mongoose

const UserBookSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,  // Thay đổi từ Schema thành mongoose.Schema
        ref: 'User', 
        required: true
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    status: {
        type: String,
        enum: ['sách yêu thích', 'Đang đọc', 'Muốn đọc'],
        default: 'Muốn đọc'
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    lastReadPage: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Đảm bảo mỗi user chỉ có 1 bản ghi cho mỗi book
UserBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model('UserBook', UserBookSchema);
