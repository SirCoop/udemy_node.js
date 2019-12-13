const express = require('express');
const router = express.Router();
const Joi = require('joi');

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

router.get('/', (req, res) => {
  res.send(courses);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

router.post('/', (req, res) => {
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

 router.put('/:id', (req, res) => {
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

 router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);

  if (!course) return res.status(404).send('The course with the given ID was not found.');

  const indexOfCourse = courses.indexOf(course);
  courses.splice(indexOfCourse, 1);

  res.send(course);
 });


 // utility functions

 function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(course, schema);
 }

 // end utility functions

 module.exports = router;