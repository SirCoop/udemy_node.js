const EventEmitter = require('events');
const emitter = new EventEmitter();

const url = 'http://mylogger.io/log';

const log = (message) => {
  // Send an HTTP request
  console.log('message: ', message);
  // Raise an event
  emitter.emit('messageLogged', { id: 1, url: 'http://garycooper.io'});
};

module.exports = log;