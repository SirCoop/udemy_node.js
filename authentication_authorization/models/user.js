const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

// encapsulate jwt functionality in Mongoose Model for user object
// Information Expert Principle: user object has enough information to handle this logic itself; no need for external function
// Note: cannot user arrow function here because we need the 'this' context of the user object
userSchema.methods.generateAuthToken = function() {
                                                                  //--Name of config property--//
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.jwtPrivateKey);
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(), // .email() ensures valid email
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;