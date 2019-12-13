const Joi = require('joi');
const logger = require('./logger');
const authenticate = require('./authenticate');
const helmet = require('helmet'); // secure app by setting HTTP headers
const morgan = require('morgan'); // log HTTP requests
const express = require('express');

const app = express();

/**
 * Middlwares are called in sequence with route handling being called last
 * Each middlware belongs in a separate file
 */

// use this first to ensure HTTP headers are set
app.use(helmet());
/**
 * tiny is a log format
 * logs can be writte to console or to a file
 */
app.use(morgan('tiny'));
// parses incoming requests with json payloads
app.use(express.json());
/**
 * parses incoming requests with url encoded payloads => key=value&key=value
 * extended: true => we can now pass arrays and complex objects using urlencoded format
 */
app.use(express.urlencoded({ extended: true }));
/**
 * serve static assests e.g. css, images
 * http://localhost:1213/readme.txt will serve readme.txt
 * */
app.use(express.static('public'));

// imported from another file
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

/**
 * GET Requests
 */

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

// basic request
app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// basic request with mandatory parameter
app.get('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

// multiple parameters in request
app.get('/api/sales/:year/:month', (req, res) => {
  const { year, month } = req.params;
  res.send({ year, month });
});

// query parameters (optional values in request)
app.get('/api/posts/:year/:month', (req, res) => {
  const { query } = req;
  res.send(query);
});


/**
 * POST Requests
 */

 // basic request with manual validation
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

 // basic request with joi validation
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


/**
 * PUT Requests
 */

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


 /**
 * DELETE Requests
 */

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