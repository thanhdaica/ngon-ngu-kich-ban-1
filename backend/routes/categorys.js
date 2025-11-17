import express from 'express';
import CategorysController from '../controllers/categorysController.js';

const routerCategorys = express.Router();
const categorysController = new CategorysController();

// Sử dụng controller thực sự thay vì chỉ trả về message
routerCategorys.get("/", categorysController.index.bind(categorysController));
routerCategorys.post("/", categorysController.store.bind(categorysController));
routerCategorys.put("/:id", categorysController.update.bind(categorysController));
routerCategorys.delete("/:id", categorysController.delete.bind(categorysController));

export default routerCategorys;