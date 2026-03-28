const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Check if user exists in the 'users' array (from general.js)
  const validUser = users.find(u => u.username === username && u.password === password);

  if (validUser) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
// Task 9: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization['username'];

  if (books[isbn]) {
    // This adds the review or updates it if the user already reviewed this book
    books[isbn].reviews[username] = review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username']; // Pull from session

  if (books[isbn]) {
    delete books[isbn].reviews[username];
    return res.status(200).send(`Review for ISBN ${isbn} deleted by user ${username}.`);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
