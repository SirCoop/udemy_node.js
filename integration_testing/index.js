/**
 * Set NODE_ENV in windows with:
 * 
 * $env:NODE_ENV="test"
 */

/**
 * Integration tests are ran off of a real database,
 * but not the same DB used for development or production.
 * 
 * This sets up a test database
 */

 /** npm supertest sends api calls similarly to POSTMAN */

const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
// export server so that it can be loaded in test file
module.exports = server;