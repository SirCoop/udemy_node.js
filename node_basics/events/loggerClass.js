const EventEmitter = require('events');

const url = 'http://mylogger.io/log';

class Logger extends EventEmitter {
  log(message) {
    // Send an HTTP request
    console.log('message: ', message);

    // Raise an event
    this.emit('messageLogged', { id: 1, url });
  }
}

module.exports = Logger;
