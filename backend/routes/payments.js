// backend/routes/payments.js
import express from 'express';
import PaymentController from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const routerPayment = express.Router();
const paymentController = new PaymentController();

// Tạo URL thanh toán (Yêu cầu đăng nhập)
routerPayment.post('/vnpay_create', protect, (req, res) => paymentController.createVnPayPayment(req, res));

// Xác thực kết quả trả về (Frontend gọi khi redirect về)
routerPayment.get('/vnpay_return', (req, res) => paymentController.vnpayReturn(req, res));

export default routerPayment;