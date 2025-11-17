import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  name : { type: String, required: [true, 'Tên sách là bắt buộc'] },
  author: { type: String, required: [true, 'Tên tác giả là bắt buộc'] },
  price: { 
    type: Number, 
    required: [true, 'Giá bán là bắt buộc'], 
    default: 0 
  },
  
  // --- Các trường cho phần "description" & "giảm giá" ---
  originalPrice: { // Giá gốc (để hiển thị gạch ngang)
    type: Number,
    // (Nên có 1 validator để đảm bảo giá gốc > giá bán)
  },
  description: String,
  coverUrl: String, // ảnh bìa sách
  categories: [{ type: mongoose.Schema.Types.ObjectId,  ref: 'Category' }],
  stockStatus: { type: String, enum: ['inStock', 'outOfStock', 'preOrder'], default: 'inStock' },
  soldQuantity: { type: Number, default: 0 },
});
export default mongoose.model('Book', bookSchema);