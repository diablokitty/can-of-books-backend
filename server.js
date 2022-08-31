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
app.use(express.json());

//ROUTES

// base route
app.get('/', (request, response) => {
  response.status(200).send('Meow-mix, meow-mix, please deliver.');
});

// books endpoint route
app.get('/books', getBooks);
app.post('/books', postBooks);
app.delete('/books/:id', deleteBooks);




// call the `getBooks` function in the books.js
async function getBooks(request, response, next) {
  try {
    // get book information from the database
    let results = await Book.find();

    // send the results of the book search back to the client
    response.status(200).send(results);
  }
  catch (e) {

    next(e);
  }
}

async function postBooks(request, response, next) {
  try {
    let createdBook = await Book.create(request.body);
    response.status(200).send(createdBook);

  } catch (e) {
    next(e);
  }
}

async function deleteBooks(request, response, next) {
  console.log('banana');
  console.log('request params: ', request.params.id);
  try {
    // try to find a book by id (from params) and delete it if it finds it
    await Book.findByIdAndDelete(request.params.id);

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
