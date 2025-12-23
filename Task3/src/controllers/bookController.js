import bookSchema from "../utils/validationSchema.js";

let books = [];

export const getAllBooks = (req, res) => {
  res.json(books);
};

export const searchBooks = (req, res) => {
  res.send("You are on the search page");
};

export const getBookById = (req, res) => {
  const { id } = req.params;

  const book = books.find((book) => book.id == id);

  if (!book) {
    return res.status(404).send("Book not found");
  }

  res.json(book);
};

export const createBook = (req, res) => {
  const { error } = bookSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const newBook = {
    id: Date.now().toString(),
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
  };

  books.push(newBook);
  res.status(201).json(newBook);
};

export const deleteBook = (req, res) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id == id);

  if (index === -1) {
    return res.status(404).send("Book not found");
  }

  books.splice(index, 1);
  res.status(200).send("Book deleted successfully");
};
