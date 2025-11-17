import express from 'express';
import BooksController from '../controllers/booksControllers.js';

const routerBooks = express.Router();
const bookscontroller = new BooksController();

routerBooks.get('/', (req, res) => bookscontroller.index(req, res));

routerBooks.post('/', (req, res) => bookscontroller.store(req, res));

routerBooks.get('/:id', (req, res) => bookscontroller.show(req, res));

routerBooks.put('/:id', (req, res) => bookscontroller.update(req, res));

routerBooks.delete('/:id', (req, res) => bookscontroller.delete(req, res));

routerBooks.get('/category/:id', (req, res) => bookscontroller.getBooksByCategory(req, res));

export default routerBooks;
