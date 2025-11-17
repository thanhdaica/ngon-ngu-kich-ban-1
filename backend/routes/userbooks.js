import express from 'express';
import UserBooksController from '../controllers/userbooksController.js';

const routerUserbooks = express.Router();
const userbooksController = new UserBooksController();

// Sử dụng controller thực sự thay vì chỉ trả về message
routerUserbooks.get("/", userbooksController.index.bind(userbooksController));
routerUserbooks.post("/", userbooksController.store.bind(userbooksController));
routerUserbooks.put("/:id", userbooksController.update.bind(userbooksController));
routerUserbooks.delete("/:id", userbooksController.delete.bind(userbooksController));

export default routerUserbooks;