'use strict';

// require

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);

// import book schema 
const Book = require('./models/book.js');


async function seed()
{
  await Book.create({
    title: 'The Old Man And The Sea',
    description: 'Fish are food, not friends!',
    status: 'Really Old'
  });
  console.log('Book 1 was added');

  await Book.create({
    title: 'The Call of Cthulhu',
    description: 'ALL HAIL THE GREAT ONE',
    status: 'Really, really, really old Gods'
  });
  console.log('Book 2 was added');

  await Book.create({
    title: 'The Ugly Barnacle',
    description: 'He was so ugly, that everyone died. THE END.',
    status: 'Salty.'
  });
  console.log('Book 3 was added');

  mongoose.disconnect();
}
/*
  1. in the terminal, install all npm dependencies
  2. run: `node seed.js`
  3. start `nodemon`
  4. check AtlasDB connections for results
*/
seed();
