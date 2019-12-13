const express = require('express');
const router = express.Router();

// instead of res.send('Hello World!!!'), we will send the view
router.get('/', (req, res) => {
  res.render('index', { title: 'My Express App', message: 'Hello'});
});

module.exports = router;