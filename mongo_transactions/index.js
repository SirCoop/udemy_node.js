/** 
 * SQL Server, MySQL
 * Transaction: a group of operations that should be performed as a unit
 *  - all must succeed or the transaction rolls back
 */

 /**
  * Mongo DB
  * 2 phase commit
  * 
  * npm package 'fawn' gives us the concept of 'Transactions' but uses the 2 phase commit concept internally
  * 
  * rentals.js
  */

const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));