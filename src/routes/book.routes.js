const express = require("express");
const router = express.Router();
const Book = require("../models/book.models");

//MIDLEWARE
const getBook= async(req, res, next) => {
    let book;
    const {id} = req.params;

    if(!id.match(/[0-9a-fA-F]{24}$/)){
        return res.status(404).json({message: 'El id del libro no es valido'});
    }
    try{
        book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: 'No se encontro el libro'});
        }
    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }

    res.book = book;
    next();
}


//Obtener todos los libros
router.get('/', async (req, res) => {
    try{
        const books = await Book.find();
        console.log('GET ALL', books);
        if(books.length === 0){
            res.status(204).json([]);
        }
        res.json(books);
    }catch(err){
        res.status(500).json({message: err.message});   
    }
})

//Crear un nuevo libro (recurso) [post]
router.post('/', async (req, res) =>{
    const {title, author, genre, publication_date } = req?.body;
    if(!title || !author || !genre || !publication_date){
        return res.status(400).json({
            message: 'Los campos de autor, titulo, género y fecha de publicación son obligatorios'
        });
    }
    const book = new Book({
        title,
        author,
        genre,
        publication_date
    })

    try{
        const newBook = await book.save();
        res.status(201).json(newBook);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

router.put('/:id', getBook, async (req, res) => {

    try{
        const book = res.book; 
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publicatioin_date || book.publication_date;

        const updateBook = await book.save();
        res.json(updateBook);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.patch('/:id', getBook, async (req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        return res.status(400).json({message: 'Los campos de autor, titulo, género y fecha de publicación son obligatorios'});
    }
    try{
        const book = res.book; 
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publicatioin_date || book.publication_date;

        const updateBook = await book.save();
        res.json(updateBook);
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

router.delete('/:id', getBook, async (req, res) => {
    try{
        const book = res.book;
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} fue eliminado exitosamente`
        })
    }catch(err){
        res.status(500).json({message: err.message});
    }
})


module.exports = router;