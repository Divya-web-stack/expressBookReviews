const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!users.find(u => u.username === username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(404).json({ message: "User already exists!" });
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
// Task 2: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // This grabs the number from the URL
  const book = books[isbn];    // This looks up that number in your booksdb.js

  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
// Task 4: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const allBooks = Object.values(books); // Convert object to array
  const filteredBooks = allBooks.filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const allBooks = Object.values(books);

  // This version is safer against small typing errors
  const filteredBooks = allBooks.filter(book => book.title.toLowerCase() === title);

  if (filteredBooks.length > 0) {
    res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from the URL
  const book = books[isbn];    // Find the book in your database

  if (book) {
    // Return only the reviews object of that book
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "No book found with this ISBN" });
  }
});

const axios = require('axios');

// Task 11 example: Get all books using Promises
public_users.get('/server/asynisbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching book by ISBN", error: err.message });
    });
});

module.exports.general = public_users;
