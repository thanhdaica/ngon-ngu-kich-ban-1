import express from 'express';
import CartsController from '../controllers/cartsController.js';
import { protect } from '../middleware/authMiddleware.js'; // <-- 1. Import "người gác cổng"

const routerCarts = express.Router();
const cartscontroller = new CartsController();

// === BẢO VỆ TẤT CẢ CÁC ĐƯỜNG DẪN BẰNG 'protect' ===

// GET /api/cart (Lấy giỏ hàng của tôi)
routerCarts.get('/', protect, (req, res) => cartscontroller.getMyCart(req, res));

// POST /api/cart (Thêm/Cập nhật sản phẩm)
routerCarts.post('/', protect, (req, res) => cartscontroller.addToCart(req, res));

// DELETE /api/cart/:productId (Xóa sản phẩm)
routerCarts.delete('/:productId', protect, (req, res) => cartscontroller.removeFromCart(req, res));

export default routerCarts;