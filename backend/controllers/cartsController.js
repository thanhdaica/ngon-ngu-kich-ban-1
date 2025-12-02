// backend/controllers/cartsController.js
import Cart from '../model/Cart.js';

class CartController {

  // 1. GET: Lấy giỏ hàng
  async getMyCart(req, res) {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ user: userId })
                             .populate('items.product', 'name price coverUrl');
      if (!cart) {
        return res.json({ user: userId, items: [] });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy giỏ hàng", error: error.message });
    }
  }

  // 2. POST: Thêm vào giỏ (CỘNG DỒN số lượng)
  async addToCart(req, res) {
    try {
      const userId = req.user._id;
      const { productId, quantity } = req.body;

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }

      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

      if (itemIndex > -1) {
        // Logic đúng: CỘNG DỒN số lượng cũ + mới
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity: quantity });
      }

      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price coverUrl');
      res.status(200).json(updatedCart);

    } catch (error) {
      res.status(500).json({ message: "Lỗi thêm giỏ hàng", error: error.message });
    }
  }

  // 3. PUT: Cập nhật giỏ hàng (GHI ĐÈ số lượng - Dùng cho nút tăng/giảm ở CartPage)
  async updateCartItem(req, res) {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body; // quantity này là số lượng MỚI (ví dụ: 5)

        let cart = await Cart.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Logic đúng: GHI ĐÈ bằng số lượng mới từ client gửi lên
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            
            const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price coverUrl');
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật giỏ hàng", error: error.message });
    }
  }

  // 4. DELETE: Xóa sản phẩm
  async removeFromCart(req, res) {
    try {
      const userId = req.user._id;
      const { productId } = req.params;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

      cart.items = cart.items.filter(item => item.product.toString() !== productId);

      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price coverUrl');
      res.status(200).json(updatedCart);

    } catch (error) {
      res.status(500).json({ message: "Lỗi xóa sản phẩm", error: error.message });
    }
  }
}

export default CartController;