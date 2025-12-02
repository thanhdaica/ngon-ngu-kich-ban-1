// backend/model/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  coverUrl: { type: String },
  price: { type: Number, required: true }, 
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Book' 
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: {
    type: String, 
    required: true,
    enum: ['COD', 'VNPAY'] // <-- Đã xóa MoMo
  },
  itemsPrice: { type: Number, required: true, default: 0.0 }, 
  shippingPrice: { type: Number, required: true, default: 0.0 }, 
  totalPrice: { type: Number, required: true, default: 0.0 }, 
  isPaid: { type: Boolean, required: true, default: false }, 
  paidAt: { type: Date }, 
  status: { 
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending' 
  },
  paymentResult: { 
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
  },
}, {
  timestamps: true 
});

export default mongoose.model('Order', orderSchema);