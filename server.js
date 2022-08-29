'use strict';

//REQUIRE
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { application } = require('express');
const mongoose = require('mongoose');


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

//ROUTES
app.get('/test', (request, response) => {

  response.send('test request received');

});

app.get('*', (request, response) => {

  response.status(500).send('Oh good Lord, what have you done now?');

});

//ERROR


//LISTEN
app.listen(PORT, () => console.log(`listening on ${PORT}`));
