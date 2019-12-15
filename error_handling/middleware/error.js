// import into routes.js and used as last middleware
const winston = require('winston');

module.exports = function(err, req, res, next){
  // this only runs for errors in the context of express.js request processing pipeline
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug 
  // silly

  res.status(500).send('Something failed.');
}