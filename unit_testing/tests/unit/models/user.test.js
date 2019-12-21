const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
  it('should return a valid JWT', () => {
    const payload = { 
      // _id is not of type string or number, its of type ObjectId
      // Therefor I cannot expect decoded payload to match { _id: 1, isAdmin: true }
      _id: new mongoose.Types.ObjectId().toHexString(), 
      isAdmin: true 
    };
    const user = new User(payload);
    // converts objectId to hexadecimal string for storage in web token
    // Therefore, above _id needs to be encoded with toHexString()
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    /**
     * jest configures NODE_ENV to test
     * Therefore, I need a new file called test.json which contains the default.json configuration
     */
    expect(decoded).toMatchObject(payload);
  });
});