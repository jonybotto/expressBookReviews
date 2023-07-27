const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if (isValid(username)) {
        res.status(404).send("Username already exists!")
  } else if (!username || !password) {
        res.status(404).send("Username and/or password not provided!")
  } else {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
  }
  return res.status(300).json({message: "Registering new user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4))
  return res.status(300).json({message: "The complete list of books is displayed"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn > 0 && req.params.isbn < 11) {
    res.send(books[req.params.isbn])
  } else {
    res.send("Invalid ISBN number")
  }
  return res.status(300).json({message: "Book details based on ISBN provided"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  bookKeys = Object.keys(books)
  const booksByAuthor = bookKeys
    .map((key) => books[key])
    .filter((book) => book.author.replace(/ /g, "") === req.params.author);
  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor)
  } else {
    return res.status(404).json({message: "No books found for the provided author"})
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  bookKeys = Object.keys(books)
  const booksByTitle = bookKeys
    .map((key) => books[key])
    .filter((book) => book.title.replace(/ /g, "") === req.params.title);
  if (booksByTitle.length > 0) {
    res.send(booksByTitle)
  } else {
    return res.status(404).json({message: "No books found for the provided title"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn > 0 && req.params.isbn < 11) {
      res.send(books[req.params.isbn].reviews)
  } else {
    res.send("Invalid ISBN number")
  }
  return res.status(300).json({message: "Book reviews for the provided ISBN"});
});

module.exports.general = public_users;
