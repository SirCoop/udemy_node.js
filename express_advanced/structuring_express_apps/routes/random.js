const express = require('express');
const router = express.Router();

/** just to demonstrate returning params vs query */
router.get('/sales/:year/:month', (req, res) => {
  const { year, month } = req.params;
  res.send({ year, month });
});

router.get('/posts/:year/:month', (req, res) => {
  const { query } = req;
  res.send(query);
});

router.post('/someResource', (req, res) => {
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

module.exports = router;