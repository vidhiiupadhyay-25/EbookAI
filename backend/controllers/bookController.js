const Book = require("../models/Book")

//@desc create a new book
// @route POST /api/books
//@access private

const createBook = async (req, res) => {
    try {
        const { title, author, subtitle, chapters } = req.body;

        if( !title || !author) {
            return res.status(400).json( { message: "Please provide a title and author "})
        }

        const book = await Book.create({
            userId: req.user._id,
            title,
            author,
            subtitle,
            chapters,
        });

        res.status(201).json(book)

    } catch (error) {
        res.status(500).json({ message: "Server error "})
    }
};

//@desc get all books for a user
//@route get /api.books
//@access private

const getBooks = async (req, res) => {
    try {
        const books = await Book.find({ userId: req.user._id }).sort({ createdAt: -1 })
        res.status(200).json(books)
    } catch (error) {
        res.status(500).json({ message: "Server error "})
    }

};

// @desc get a single book by id
//@route get /api/books/:id
// @access private

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if(!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if(book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to view this book"})
        }

        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({ message: "Server error "})
    }
};

// @desc update a book
// @route put /api/books/:id
// @access private
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if (book.userId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this book" })
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedBook);   // ✅ correct

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
};

//@desc delete a book
//@route delete /api/books/:id
//@access private
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found "})
        }

        if(book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "not aunthorized to delete this book "})
        }

        await book.deleteOne();

        res.status(200).json({ message: "Book deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error "})
    }
};

// @desc update a books's cover image
// @route put /api/books/cover/:id
// @access private
const updateBookCover = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        if (!book) {
            return res.status(404).json({ message: "Book not found" })
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" })
        }

        console.log("FILE:", req.file); 

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" })
        }

        /*book.coverImage = `uploads/${req.file.filename}`*/
        book.coverImage = `/backend/uploads/${req.file.filename}`


        const updatedBook = await book.save()

        res.status(200).json(updatedBook)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover,
};