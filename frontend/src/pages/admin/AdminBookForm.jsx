import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function AdminBookForm() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { token } = useAuth();
    
    const isEditMode = !!id; 
    
    // [MỚI] State để lưu danh sách tất cả thể loại lấy từ API
    const [categoriesList, setCategoriesList] = useState([]);

    // State cho Form
    const [formData, setFormData] = useState({
        name: '',
        author: '',
        price: 0,
        originalPrice: 0,
        description: '',
        coverUrl: '',
        categoryId: '', // [MỚI] Dùng để lưu ID thể loại được chọn từ dropdown
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    // [MỚI] Effect để tải danh sách thể loại khi component được mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Giả sử route của bạn là /api/categorys (khớp với file routes/categorys.js bạn gửi)
                const res = await axios.get('http://localhost:3000/api/category');
                setCategoriesList(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách thể loại:", error);
                toast.error("Không thể tải danh sách thể loại");
            }
        };
        fetchCategories();
    }, []);

    // Logic tải dữ liệu sách (Chỉ chạy ở chế độ Sửa)
    useEffect(() => {
        if (!isEditMode) return;
        
        const fetchBookData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/book/${id}`);
                const bookData = response.data;
                
                // [LOGIC MỚI] Xử lý categories: Lấy phần tử đầu tiên trong mảng categories của sách để hiển thị lên dropdown
                // Vì Model Book lưu categories là mảng [], nhưng dropdown chỉ chọn 1
                const currentCategoryId = (bookData.categories && bookData.categories.length > 0) 
                    ? (typeof bookData.categories[0] === 'object' ? bookData.categories[0]._id : bookData.categories[0]) 
                    : '';

                setFormData({
                    name: bookData.name || '',
                    author: bookData.author || '',
                    price: bookData.price || 0,
                    originalPrice: bookData.originalPrice || 0,
                    description: bookData.description || '',
                    coverUrl: bookData.coverUrl || '',
                    categoryId: currentCategoryId, // Gán giá trị cho dropdown
                });
            } catch (error) {
                toast.error("Lỗi tải dữ liệu sách cũ.");
                console.error(error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchBookData();
    }, [id, isEditMode]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    // Xử lý Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const config = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        // [MỚI] Chuẩn bị dữ liệu gửi đi
        // Backend Model Book yêu cầu 'categories' là một Array, nên ta bọc categoryId vào mảng
        const dataToSend = {
            ...formData,
            categories: formData.categoryId ? [formData.categoryId] : [] 
        };

        const method = isEditMode ? 'put' : 'post';
        const url = isEditMode 
            ? `http://localhost:3000/api/book/${id}` 
            : 'http://localhost:3000/api/book';

        try {
            await axios[method](url, dataToSend, config);
            
            toast.success(isEditMode 
                ? "Cập nhật sách thành công!" 
                : "Thêm sách mới thành công!");
            
            navigate('/admin/books'); 
        } catch (error) {
            console.error("Lỗi khi lưu sách:", error);
            toast.error(error.response?.data?.message || `Lỗi: ${isEditMode ? 'Cập nhật' : 'Thêm mới'} sách thất bại.`);
        } finally {
            setLoading(false);
        }
    };
    
    if (initialLoading) {
        return <div className="text-center p-10">Đang tải dữ liệu sách...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                {isEditMode ? 'Sửa Thông Tin Sách' : 'Thêm Sách Mới'}
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                
                {/* Tên sách */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên sách</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="mt-1 w-full p-2 border rounded-md" />
                </div>

                {/* [MỚI] Dropdown chọn Thể Loại */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thể loại sách</label>
                    <select 
                        name="categoryId" 
                        value={formData.categoryId} 
                        onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md bg-white"
                    >
                        <option value="">-- Chọn thể loại --</option>
                        {categoriesList.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Tác giả */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tác giả</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required
                        className="mt-1 w-full p-2 border rounded-md" />
                </div>
                
                {/* Giá bán và Giá gốc */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá bán (VNĐ)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required
                            className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giá gốc (VNĐ)</label>
                        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange}
                            className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                </div>

                {/* URL Ảnh bìa */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">URL Ảnh bìa (coverUrl)</label>
                    <input type="text" name="coverUrl" value={formData.coverUrl} onChange={handleChange}
                        className="mt-1 w-full p-2 border rounded-md" />
                    {formData.coverUrl && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Xem trước:</p>
                            <img src={formData.coverUrl} alt="Ảnh bìa xem trước" className="w-32 h-48 object-cover rounded shadow"/>
                        </div>
                    )}
                </div>
                
                {/* Mô tả */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="5"
                        className="mt-1 w-full p-2 border rounded-md"></textarea>
                </div>
                
                {/* Nút Submit */}
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                    {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập Nhật Sách' : 'Thêm Sách')}
                </button>
            </form>
        </div>
    );
}