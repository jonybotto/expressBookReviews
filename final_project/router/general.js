const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

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
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    booksPromise = new Promise((resolve, reject) => {
        try {
            const data = JSON.stringify(books, null, 4)
            resolve(data)
        } catch(err) {
            reject(err)
        }
    })
    booksPromise.then(
        (data) => res.status(200).send(data),
        (err) => res.status(404).send("Could not get data")
    )
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
    try {
        if (req.params.isbn > 0 && req.params.isbn < 11) {
            const data = await books[req.params.isbn]
            res.status(200).send(data)
        } else {
            res.status(404).send("Invalid ISBN number")
        }
    } catch(err) {
        res.status(404).send("Oops... Something went wrong")
    }
})

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
    try {
        bookKeys = Object.keys(books)
        const booksByAuthor = await bookKeys
            .map((key) => books[key])
            .filter((book) => book.author.replace(/ /g, "") === req.params.author);
        if (booksByAuthor.length > 0) {
            res.status(200).send(booksByAuthor)
        } else {
            return res.status(404).json({message: "No books found for the provided author"})
        }
    } catch(err) {
        return res.status(404).json({message: "Oops... Something went wrong"})
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
    try {
        bookKeys = Object.keys(books)
        const booksByTitle = await bookKeys
            .map((key) => books[key])
            .filter((book) => book.title.replace(/ /g, "") === req.params.title);
        if (booksByTitle.length > 0) {
            res.status(200).send(booksByTitle)
        } else {
            return res.status(404).json({message: "No books found for the provided title"})
        }
    } catch(err) {
        return res.status(404).json({message: "Oops... Something went wrong"})
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn > 0 && req.params.isbn < 11) {
    res.status(200).send(books[req.params.isbn].reviews)
  } else {
    res.status(404).send("Invalid ISBN number")
  }
});

module.exports.general = public_users;
