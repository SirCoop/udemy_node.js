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
const Joi = require('joi');
const logger = require('./logger');
const authenticate = require('./authenticate');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(helmet());

startupDebugger("Application Name: ", config.get('name'));
startupDebugger("Mail Server: ", config.get('mail.host'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled');
}

// Db work...
dbDebugger('Connected to the database...');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);
app.use(authenticate);

const courses = [
  {
    id: 1,
    name: 'course1',
  },
  {
    id: 2,
    name: 'course2',
  },
  {
    id: 3,
    name: 'course3',
  },
];

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

app.get('/api/sales/:year/:month', (req, res) => {
  const { year, month } = req.params;
  res.send({ year, month });
});

app.get('/api/posts/:year/:month', (req, res) => {
  const { query } = req;
  res.send(query);
});

app.post('/api/someResource', (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    return res.status(400).send('Name is required and should be a minumum of 3 characters.');
  }
  const { name } = req.body;
  const course = {
    id: courses.length + 1,
    name,
  };
  courses.push(course);
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) {
    const { details } = error;
    const { message } = details[0];
    return res.status(400).send(message);
  }

  const { name } = req.body;
  const course = {
    id: courses.length + 1,
    name,
  };
  courses.push(course);
  res.send(course);
});

 app.put('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);

  if (!course) return res.status(404).send('The course with the given ID was not found.');
  const { error } = validateCourse(req.body);
  if (error) {
    const { details } = error;
    const { message } = details[0];
    return res.status(400).send(message);
  }
  course.name = req.body.name;
  res.send(course);
 });

 // DRY abstraction
 function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
 }

 app.delete('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);

  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const indexOfCourse = courses.indexOf(course);
  courses.splice(indexOfCourse, 1);

  res.send(course);
 });

// production host port is dynamically assigned, therefore we need environment variable PORT.
// Read env vars via process object
const port = process.env.PORT || 1213;
app.listen(port, () => console.log(`Listening on port ${port}...`));