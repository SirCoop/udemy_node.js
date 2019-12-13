// dependencies get listed first
const Joi = require('joi');
const express = require('express');

const app = express();

// request body json parsing is not enabled by default
// add middleware to parse json in request body
app.use(express.json());

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
  // params come in as strings
  // course ids are numbers, so we must parse
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);
  // 404 - resource (item or collection) not found
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
  // never trust what the client sends, always validate
  if (!req.body.name || req.body.name.length < 3) {
    // 400 Bad Request
    return res.status(400).send('Name is required and should be a minumum of 3 characters.');
  }
  const { name } = req.body;
  const course = {
    id: courses.length + 1,
    name,
  };
  courses.push(course);
  // when a new object is created by a DB, the newly created
  // object should be returned to the UI because the user
  // likely needs the id
  res.send(course);
});

 // basic request with joi validation
app.post('/api/courses', (req, res) => {
  /**
   * NOTE: manual validations can get lengthy, use joi instead
   * joi requires a schema
   */

  const { error } = validateCourse(req.body);
  if (error) {
    // 400 Bad Request
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
  // when a new object is created by a DB, the newly created
  // object should be returned to the UI because the user
  // likely needs the id
  res.send(course);
});


/**
 * PUT Requests
 */

 app.put('/api/courses/:id', (req, res) => {
  // 1) Look up course
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);

  // 2) If not existing return 404
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  // 3) Validate
  const { error } = validateCourse(req.body);
  if (error) {
    // 400 Bad Request
    const { details } = error;
    const { message } = details[0];
    return res.status(400).send(message);
  }

  // 4) Return course
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
  // 1) Look up course
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);

  // 2) If not existing return 404
  if (!course) return res.status(404).send('The course with the given ID was not found.');

  // 3) Delete
  const indexOfCourse = courses.indexOf(course);
  courses.splice(indexOfCourse, 1);

  // 4) Return the same course
  res.send(course);
 });


// production host port is dynamically assigned, therefore we need environment variable PORT.
// Read env vars via process object
const port = process.env.PORT || 1213;
app.listen(port, () => console.log(`Listening on port ${port}...`));