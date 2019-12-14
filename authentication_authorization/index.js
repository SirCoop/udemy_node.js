/**
 * Authentication = Identify user
 * AUthorization = Determine user permissions 
 */

 /**
  * New Endpoints
  * 
  * Register: POST  /api/users { name, email, password }
  *   UserSchema: {
  *     email: {
  *       type: String,
  *       unique: true <- ensure unique users
  *     }
  *   }
  * 
  * 
  * Login:    POST  /api/logins
  */

  /**
   * Password Complexity Enforcement
   * 
   * npm install joi-password-complexity
   */

   /**
    * Hash Password
    * 
    * salt = a random string added before or after a password so the resulting
    *         hashed password is different based on the salt used
    * 
    * bcrypt uses original salt to decrypt hashed password, hence why salt is included in hash:
    *   bcrypt.compare(req.body.password, user.password)
    *   - user.password has original salt which is used to hash the req.body.password
    *   - bcrypt then compares the two values to see if they match
    */

 const config = require('config');
 const Joi = require('joi');
 Joi.objectId = require('joi-objectid')(Joi);
 const mongoose = require('mongoose');
 const genres = require('./routes/genres');
 const customers = require('./routes/customers');
 const movies = require('./routes/movies');
 const rentals = require('./routes/rentals');
 const users = require('./routes/users');
 const auth = require('./routes/auth');
 const express = require('express');
 const app = express();
 
 if (!config.get('jwtPrivateKey')) {
   console.error('FATAL ERROR: jwtPrivateKey is not defined.');
   process.exit(1);
 }
 
 mongoose.connect('mongodb://localhost/vidly')
   .then(() => console.log('Connected to MongoDB...'))
   .catch(err => console.error('Could not connect to MongoDB...'));
 
 app.use(express.json());
 app.use('/api/genres', genres);
 app.use('/api/customers', customers);
 app.use('/api/movies', movies);
 app.use('/api/rentals', rentals);
 app.use('/api/users', users);
 app.use('/api/auth', auth);
 
 const port = process.env.PORT || 3000;
 app.listen(port, () => console.log(`Listening on port ${port}...`));