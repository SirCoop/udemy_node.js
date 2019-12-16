
module.exports = function() {
  if (!process.env.jwtPrivateKey) {
    // always throw error object because it makes the stacktrace available 
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}