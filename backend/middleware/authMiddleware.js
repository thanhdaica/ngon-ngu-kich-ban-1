import jwt from 'jsonwebtoken';
import User from '../model/User.js';

/**
 * "Người gác cổng" (Middleware)
 * Nhiệm vụ: Kiểm tra token (thẻ thông hành) trước khi cho request đi tiếp
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem request có gửi "Authorization" header không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') // Tiêu chuẩn là "Bearer [token]"
  ) {
    try {
      // 2. Lấy token ra (bỏ chữ "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 3. Xác thực token
      // Dùng "con dấu bí mật" (JWT_SECRET) để kiểm tra
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Lấy thông tin User từ ID (đã được mã hóa trong token)
      // Gán thông tin user vào `req` để các hàm controller sau có thể dùng
      req.user = await User.findById(decoded.id).select('-password');
      
      // 5. Nếu mọi thứ hợp lệ, cho phép request đi tiếp
      next();

    } catch (error) {
      // Nếu token sai (bị làm giả, hết hạn...)
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }

  // Nếu không tìm thấy token (chưa đăng nhập)
  if (!token) {
    res.status(401).json({ message: 'Không có token, không có quyền truy cập' });
  }
};

export { protect };