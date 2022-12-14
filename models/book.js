'use strict';

//bring in mongoose
const mongoose=require('mongoose');

//extract the schema property from mongoose object
const { Schema } = mongoose;

//declare the book schema
const bookSchema = new Schema({

  title: {type: String, required: true},
  description: {type: String, required: true},
  status: {type: String, required: true}

});

// define the model

// allows our `BookModel` to use `mongoose` methods
const BookModel = mongoose.model('Book', bookSchema);

module.exports = BookModel;

