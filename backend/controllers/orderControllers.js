// backend/controllers/orderControllers.js
import Order from '../model/Order.js';
import Book from '../model/Book.js'; 
import Cart from '../model/Cart.js'; 

class OrderController {
    // [POST] /api/order
    async addOrderItems(req, res) {
        const userId = req.user._id; 
        // 1. NHẬN THÊM selectedItemIds TỪ BODY (Danh sách ID sản phẩm được chọn)
        const { shippingAddress, paymentMethod, selectedItemIds } = req.body;
        
        if (!shippingAddress || !paymentMethod) {
             return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng và phương thức thanh toán.' });
        }

        // Kiểm tra xem người dùng có chọn sản phẩm nào không
        if (!selectedItemIds || !Array.isArray(selectedItemIds) || selectedItemIds.length === 0) {
            return res.status(400).json({ message: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.' });
       }

        try {
            // 2. Lấy giỏ hàng hiện tại
            const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price coverUrl');
            
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Giỏ hàng của bạn đang trống.' });
            }

            // 3. LỌC VÀ TÍNH TIỀN CHỈ CÁC MÓN ĐƯỢC CHỌN
            let itemsPrice = 0;
            const finalOrderItems = [];
            
            for (const item of cart.items) {
                // LOGIC QUAN TRỌNG: Kiểm tra xem item có nằm trong danh sách được chọn không
                if (selectedItemIds.includes(item.product._id.toString())) {

                    // Bỏ qua nếu sản phẩm lỗi/không tồn tại
                    if (!item.product || !item.product.price) continue; 

                    const price = item.product.price;
                    const name = item.product.name;
                    const coverUrl = item.product.coverUrl;
                    
                    itemsPrice += price * item.quantity;

                    finalOrderItems.push({
                        name,
                        coverUrl,
                        quantity: item.quantity,
                        price,
                        product: item.product._id 
                    });
                }
            }

            if (finalOrderItems.length === 0) {
                 return res.status(400).json({ message: 'Các sản phẩm bạn chọn không hợp lệ hoặc không tồn tại.' });
            }

            const shippingPrice = 30000; // Phí ship cố định
            const totalPrice = itemsPrice + shippingPrice;

            // 4. TẠO ĐƠN HÀNG MỚI
            const order = new Order({
                user: userId,
                orderItems: finalOrderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
            });

            const createdOrder = await order.save();
            
            // 5. CẬP NHẬT LẠI GIỎ HÀNG (QUAN TRỌNG)
            // Chỉ giữ lại những món KHÔNG nằm trong danh sách đã mua
            cart.items = cart.items.filter(item => !selectedItemIds.includes(item.product._id.toString()));
            await cart.save();
            
            // 6. Trả về kết quả
            res.status(201).json({ 
                message: 'Tạo đơn hàng thành công!',
                data: createdOrder 
            });

        } catch (error) {
            console.error('❌ Lỗi khi tạo đơn hàng:', error);
            res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng', error: error.message });
        }
    }
    
    // [GET] /api/order/:id (Giữ nguyên)
    async getOrderById(req, res) {
        try {
            const order = await Order.findById(req.params.id).populate('user', 'name email');

            if (order) {
                if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                    return res.status(403).json({ message: "Bạn không có quyền xem đơn hàng này." });
                }
                res.json(order);
            } else {
                res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server khi xem chi tiết đơn hàng', error: error.message });
        }
    }

    // [GET] /api/order (Giữ nguyên)
    async getAllOrders(req, res) {
        try {
            const orders = await Order.find({}).populate('user', 'name email');
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng', error: error.message });
        }
    }
}

export default OrderController;