import mongoose from 'mongoose';

// Đây là thiết kế cho 1 SẢN PHẨM BÊN TRONG giỏ hàng
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Liên kết đến model 'Book'
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
  // (Bạn có thể thêm 'price' ở đây, nhưng an toàn hơn là lấy giá từ 'Book'
  //  để đảm bảo giá luôn đúng)
});

// Đây là thiết kế cho TOÀN BỘ GIỎ HÀNG
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Liên kết đến model 'User'
    required: true,
    unique: true // Đảm bảo mỗi user chỉ có MỘT giỏ hàng
  },
  items: [cartItemSchema] // Là một mảng chứa các sản phẩm ở trên
  
}, {
  timestamps: true // Tự động thêm createdAt, updatedAt
});

export default mongoose.model('Cart', cartSchema);