'use strict';

//REQUIRE
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { application } = require('express');
const mongoose = require('mongoose');

// import our Book schema, so we can interact with
const Book = require('./models/book.js');

// add validation to confirm we are wired up to our mongo DB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
});


//connect mongoose to mongo
mongoose.connect(process.env.DB_URL);

//USE
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

// need this, so that our backend server can read and interpret JSON data from mongoose
app.use(express.json());

//ROUTES

// base route
app.get('/', (request, response) => {
  response.status(200).send('Meow-mix, meow-mix, please deliver.');
});

// books endpoint routes
app.get('/books', getBooks);
app.post('/books', postBooks);

// must pass in `:id` param when making a delete request
// the `:` means that we're declaring whatever we're writing after `/books` to be a parameter called `id`
// NOTE: we can just dump the id
app.delete('/books/:id', deleteBooks);



// this function find book objects in our database
// call the `getBooks` function in books.js module
async function getBooks(request, response, next) {
  try {
    // get book information from the database
    // MOdel.find() accepts an object as a parameter to use to search for specific items
    // passing in an empty object will return all books
    // mongoose, not axios, so we don't need to look in .data
    let results = await Book.find({});

    // send the results of the book search back to the client
    response.status(200).send(results);
  }
  catch (e) {
    next(e);
  }
}

async function postBooks(request, response, next) {
  try {
    // post the book object from client to our database and get back the database's versions of the object back into `createdBook`
    // mongoose attaches '_id' and version number properties when we send it over
    // can access the client's `book` object using `request.body`
    let createdBook = await Book.create(request.body);

    // send createdBook back to front-end, with '_id' and version number properties generated by `mongoose`
    response.status(200).send(createdBook);
  } catch (e) {
    next(e);
  }
}

async function deleteBooks(request, response, next) {
  // log to see what parameters the user passed in
  // console.log('request params: ', request.params.id);
  try {
    // try to find a book by id (from params) and delete it if it finds it
    await Book.findByIdAndDelete(request.params.id);

    // send back a message to the client to confirm that a the book was actually deleted from the database
    // NOTE: don't use status `200` here; find a different code that's more appropriate for DELETE
    response.status(200).send('Deleted book');
  }
  catch (e) {

    next(e);
  }
}

// catch-all route
app.get('*', (request, response) => {

  response.status(500).send('Oh good Lord, what have you done now?');

});

//ERROR
app.use((error, request, response) => {
  console.log(error.message);
  response.status(500).send(`You're fired, Mr. Squidward: `, error.message);
});

//LISTEN
app.listen(PORT, () => console.log(`listening on ${PORT}`));
