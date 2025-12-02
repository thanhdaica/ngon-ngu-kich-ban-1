import Order from '../model/Order.js';
import crypto from 'crypto';
import 'dotenv/config';
import querystring from 'qs';
import dateFormat from 'dateformat';

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

class PaymentController {

    // 1. TẠO URL THANH TOÁN VNPAY
    async createVnPayPayment(req, res) {
        try {
            const { orderId, amount, bankCode, language } = req.body;
            
            let ipAddr = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            const tmnCode = process.env.VNP_TMN_CODE;
            const secretKey = process.env.VNP_HASH_SECRET;
            let vnpUrl = process.env.VNP_URL;
            const returnUrl = process.env.VNP_RETURN_URL;

            let date = new Date();
            let createDate = dateFormat(date, 'yyyymmddHHMMss');
            let orderIdInfo = orderId; 

            let locale = language || 'vn';
            let currCode = 'VND';
            
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = orderIdInfo;
            vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang:' + orderIdInfo;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100; 
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;

            if(bankCode && bankCode !== "") {
                vnp_Params['vnp_BankCode'] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
            
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

            res.status(200).json({ paymentUrl: vnpUrl });

        } catch (error) {
            console.error("Lỗi tạo VNPay URL:", error);
            res.status(500).json({ message: "Lỗi tạo thanh toán VNPay" });
        }
    }

    // 2. XỬ LÝ KẾT QUẢ TRẢ VỀ (QUAN TRỌNG: ĐÃ SỬA ĐỂ CẬP NHẬT STATUS)
    async vnpayReturn(req, res) {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let secretKey = process.env.VNP_HASH_SECRET;

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");

        if(secureHash === signed){
            // Checksum hợp lệ
            const orderId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];

            // Mã 00 là thành công
            if(rspCode === '00') {
                 await Order.findByIdAndUpdate(orderId, {
                    isPaid: true,
                    paidAt: new Date(),
                    paymentMethod: 'VNPAY',
                    status: 'Processing', // <--- ĐÃ THÊM: Chuyển trạng thái sang Đang xử lý
                    paymentResult: { 
                        id: vnp_Params['vnp_TransactionNo'], 
                        status: 'SUCCESS', 
                        update_time: vnp_Params['vnp_PayDate'] 
                    }
                });
                res.status(200).json({ message: 'Giao dịch thành công', code: '00' });
            } else {
                // Giao dịch thất bại thì giữ nguyên Pending hoặc có thể chuyển sang Cancelled nếu muốn
                res.status(400).json({ message: 'Giao dịch thất bại', code: rspCode });
            }
        } else {
            res.status(400).json({ message: 'Chữ ký không hợp lệ', code: '97' });
        }
    }
}

export default PaymentController;