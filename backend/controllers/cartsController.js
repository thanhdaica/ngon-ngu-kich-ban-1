import Cart from '../model/Cart.js';
import Book from '../model/Book.js'; // Cần để kiểm tra sách

class CartController {

  /**
   * API: GET /api/cart
   * MỤC ĐÍCH: Lấy giỏ hàng của user đang đăng nhập
   */
  async getMyCart(req, res) {
    try {
      const userId = req.user._id;

      // Tìm giỏ hàng VÀ "populate" (lấy) thông tin chi tiết của sách
      const cart = await Cart.findOne({ user: userId })
                             .populate('items.product', 'name price coverUrl'); // Chỉ lấy 3 trường này

      if (!cart) {
        // Nếu user chưa có giỏ hàng, trả về một giỏ hàng rỗng
        return res.json({ user: userId, items: [] });
      }

      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy giỏ hàng", error: error.message });
    }
  }

  /**
   * API: POST /api/cart
   * MỤC ĐÍCH: Thêm/Cập nhật sản phẩm trong giỏ
   * (Frontend sẽ gửi { "productId": "...", "quantity": 1 })
   */
  async addToCart(req, res) {
    try {
      const userId = req.user._id;
      const { productId, quantity } = req.body;

      // 1. Kiểm tra đầu vào
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
      }

      // 2. Tìm giỏ hàng của user
      let cart = await Cart.findOne({ user: userId });

      // 3. Nếu user chưa có giỏ hàng, tạo mới
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }

      // 4. Kiểm tra xem sản phẩm đã có trong giỏ chưa
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        // Nếu đã có, cập nhật số lượng
        cart.items[existingItemIndex].quantity = quantity;
      } else {
        // Nếu chưa có, thêm mới
        cart.items.push({ product: productId, quantity: quantity });
      }

      // 5. Lưu lại giỏ hàng
      await cart.save();
      
      // 6. Trả về giỏ hàng đã được cập nhật (populate để frontend hiển thị)
      const updatedCart = await Cart.findById(cart._id)
                                    .populate('items.product', 'name price coverUrl');
      
      res.status(200).json(updatedCart);

    } catch (error) {
      res.status(500).json({ message: "Lỗi thêm vào giỏ hàng", error: error.message });
    }
  }

  /**
   * API: DELETE /api/cart/:productId
   * MỤC ĐÍCH: Xóa một sản phẩm khỏi giỏ hàng
   */
  async removeFromCart(req, res) {
    try {
      const userId = req.user._id;
      const { productId } = req.params; // Lấy ID sản phẩm từ URL

      const cart = await Cart.findOne({ user: userId });

      if (!cart) {
        return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
      }

      // Lọc ra, chỉ giữ lại những item không trùng với productId
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );

      await cart.save();
      
      const updatedCart = await Cart.findById(cart._id)
                                    .populate('items.product', 'name price coverUrl');

      res.status(200).json(updatedCart);

    } catch (error) {
      res.status(500).json({ message: "Lỗi xóa khỏi giỏ hàng", error: error.message });
    }
  }
}

export default CartController;