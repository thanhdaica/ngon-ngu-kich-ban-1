import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,  // Tên thể loại là bắt buộc
    unique: true,    // Đảm bảo tên thể loại là duy nhất
    trim: true       // Loại bỏ khoảng trắng thừa ở đầu và cuối
  },
  description: {
    type: String, 
    default: '',     // Mô tả là tùy chọn
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book', // Liên kết đến model Book
    }
  ],
  coverUrl: String, // ảnh bìa thể loại 
  createdAt: { 
    type: Date, 
    default: Date.now  // Mặc định là thời điểm tạo thể loại
  }
});

export default mongoose.model('Category', categorySchema);
