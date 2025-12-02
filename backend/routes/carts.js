// backend/routes/carts.js
import express from 'express';
import CartsController from '../controllers/cartsController.js';
import { protect } from '../middleware/authMiddleware.js';

const routerCarts = express.Router();
const cartscontroller = new CartsController();

// Lấy giỏ hàng
routerCarts.get('/', protect, (req, res) => cartscontroller.getMyCart(req, res));

// Thêm vào giỏ (Dùng POST)
routerCarts.post('/', protect, (req, res) => cartscontroller.addToCart(req, res));

// Cập nhật số lượng (THÊM MỚI route PUT này)
routerCarts.put('/', protect, (req, res) => cartscontroller.updateCartItem(req, res));

// Xóa sản phẩm
routerCarts.delete('/:productId', protect, (req, res) => cartscontroller.removeFromCart(req, res));

export default routerCarts;