import express from 'express';
import 'dotenv/config'; // Cách 1: Import và tự động chạy config
import router from './routes/index.js';
import connectMDB from './connect.js';
import cors from 'cors';
const app = express();

const PORT = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));


// Routes
// Lưu ý: Bạn đang import 'router' từ './routes/index.js' và gọi nó như một function.
// Đảm bảo file './routes/index.js' của bạn được thiết kế để nhận 'app' làm đối số.
router(app);

//kết nối với database
const uri = process.env.MONGO_URI || null;
connectMDB(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server bắt đầu trên cổng ${PORT}`);
    });
  });