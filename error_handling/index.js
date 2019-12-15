/**
 * Loggers (winston)
 * 
 * Transport: storage device for logs
 * winston core transports: console, file, http (call an endpoint for logging messages)
 */

const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));