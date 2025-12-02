// frontend/src/pages/PaymentResultPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentResultPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failed'

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Lấy toàn bộ tham số từ URL do VNPay trả về
                const params = Object.fromEntries([...searchParams]);
                
                // Gọi Backend để verify checksum
                const response = await axios.get('http://localhost:3000/api/payment/vnpay_return', { params });

                if (response.data.code === '00') {
                    setStatus('success');
                    // Tự động về trang chủ sau 3 giây
                    setTimeout(() => navigate('/'), 3000); 
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                console.error("Lỗi xác thực thanh toán:", error);
                setStatus('failed');
            }
        };

        // Chỉ chạy nếu có tham số trả về
        if (searchParams.toString()) {
            verifyPayment();
        } else {
            setStatus('failed');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                
                {status === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-700">Đang xử lý kết quả thanh toán...</h2>
                        <p className="text-gray-500 mt-2">Vui lòng không tắt trình duyệt.</p>
                    </>
                )}
                
                {status === 'success' && (
                    <>
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <h2 className="text-2xl font-bold text-green-600">Thanh toán Thành công!</h2>
                        <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua hàng. Đang chuyển hướng về trang chủ...</p>
                        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            Về trang chủ ngay
                        </button>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-2xl font-bold text-red-600">Thanh toán Thất bại</h2>
                        <p className="text-gray-600 mt-2">Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình xử lý.</p>
                        <button onClick={() => navigate('/cart')} className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
                            Quay lại giỏ hàng
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}