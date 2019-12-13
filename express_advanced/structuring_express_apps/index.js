/**
 * multiple debuggers each having its own namespace
 * in environment variables, the type of debugger can be set
 * 
 * set environment variables in powershell:
 * $env:DEBUG="app:startup"
 * 
 * e.g. DEBUG=app:startup -> enables app:startup debugger
 * e.g. DEBUG=app:startup,app:db -> enables app:startup and app:db debugger
 * e.g. DEBUG=app:* -> enables all debugger
 *      DEBUG= -> turns off debugger
 */
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const logger = require('./middleware/logger');
const authenticate = require('./authenticate');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
//abstracted routes
const courses = require('./routes/courses');
const home = require('./routes/home');
const randomRoutes = require('./routes/random');

// app
const app = express();

// view engine
app.set('view engine', 'pug');
app.set('views', './views'); // default - set explicitly here just to demonstrate

app.use(helmet());

startupDebugger("Application Name: ", config.get('name'));
startupDebugger("Mail Server: ", config.get('mail.host'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled');
}

// Db work...
dbDebugger('Connected to the database...');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);
app.use(authenticate);

// abstracted routes
app.use('/', home);
app.use('/api/courses', courses);
app.use('/api/random', randomRoutes);

const port = process.env.PORT || 1213;
app.listen(port, () => console.log(`Listening on port ${port}...`));