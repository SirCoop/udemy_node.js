const jwt = require('jsonwebtoken');

// this middleware verifies the user has a valid token before allowing api operations
module.exports = function (req, res, next) {
  // returns value of header key
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    /**
     * decoded = { _id: this._id, isAdmin: this.isAdmin },
     * which is what we used to sign the token in model/user.js
     */
    req.user = decoded;
    // now we can access req.user._id or req.user.isAdmin in our route handlers
    
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
};