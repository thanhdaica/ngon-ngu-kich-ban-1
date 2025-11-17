import mongoose from "mongoose";
export default async function connectMDB(uri) {
    try {
        await mongoose.connect(uri);
        console.log('Kết nối thành công với database');
    } catch (error) {
        console.log('Kết nối thất bại với database');
    }
}