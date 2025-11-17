import express from 'express';
import UsersController from '../controllers/usersController.js';
import { protect } from '../middleware/authMiddleware.js';

const routerUsers = express.Router();
const userscontroller = new UsersController();

// POST /api/user/register
routerUsers.post('/register', (req, res) => userscontroller.register(req, res));

// POST /api/user/login
routerUsers.post('/login', (req, res) => userscontroller.login(req, res));

// (Bạn có thể thêm các route khác sau, ví dụ: lấy tất cả user)
// GET /api/user
routerUsers.get('/', (req, res) => userscontroller.index(req, res));

routerUsers.get('/profile', protect, (req, res) => userscontroller.getMyProfile(req, res));
routerUsers.put('/profile', protect, (req, res) => userscontroller.updateMyProfile(req, res));


export default routerUsers;