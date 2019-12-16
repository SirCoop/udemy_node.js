const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    /**
     *  - If uncaughtExceptions happen, we should terminate and restart the process so that it exists in a clean state
     *  - use a process manager for this
     * 
     *  process.on('uncaughtException', (ex) => {
          winston.error(ex.message, ex);
          // terminate process
          process.exit(1)
        });

        NOTE: winston.handleExceptions() is a helper method to replace the above event emitter
        Does not work for unHandledRejections
     */

  // this allows us to handle and log exceptions outside of the context of express
  // only works for synchronous code, not for promises
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  ); 
  
  /**
   *  this is an event emitter that allows us to subscribe to unhandled promise rejections
   *  e.g.:
   *  const p = Promise.reject(new Error('Something failed'));
   *  p.then(() => console.log('Done'))
   * 
   *  NOTICE: I did not call p.catch(), therefore this is an unhandled promise rejection
   * 
   */
  
  process.on('unhandledRejection', (ex) => {
    /**
     * throwing this exception when an unHandled Promise rejection occurs,
     * allows winston.handleExceptions (see above) to log this unHandledPromise rejection
     */
    throw ex;
  });
  
  // File Transport
  winston.add(winston.transports.File, { filename: 'logfile.log' });
  // DB Transport (In real world, we may want to separate the log DB from the operational DB)
  winston.add(winston.transports.MongoDB, { 
    db: 'mongodb://localhost/vidly',
    level: 'info'
  });  
}