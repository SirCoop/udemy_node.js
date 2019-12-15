
module.exports = function (req, res, next) { 
  // 401 Unauthorized
  // 403 Forbidden 
  
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');
  // if user isAdmin, pass control to next middleware
  next();
}