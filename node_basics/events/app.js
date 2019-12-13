// Event: a signal that something has happened

// import Logger, which extends EventEmitter in LoggerClass.js
const Logger = require('./loggerClass');
const logger = new Logger();

// Register an event listener
logger.on('messageLogged', (eventData) => console.log('Listener called: ', eventData));

// Raise an event
logger.log('message');


/**
 * BASIC USAGE
 * 
  Register an event listener
  emitter.addListener('messageLogged', (eventData) => console.log('Listener called: ', eventData));

  Raise an event
  emitter.emit('messageLogged', { id: 1, url: 'http://garycooper.io'});
 * 
 */

/** 
 * REASON FOR EXTENDING EVENT EMITTER CLASS
 * 
 * NOTE: logger does not fire here because we use two different instance
 * 
  const EventEmitter = require('events');
  const emitter = new EventEmitter();

  Register an event listener
  emitter.on('messageLogged', (eventData) => console.log('Listener called: ', eventData));

  const log = require('./logger');

  The listener will not fire because I have two different emitter instances working right now.
  I have an instance in logger.js emitting an event, and a different instance here listening.
  This is why we need to extend the event emitter!

  log('log message to be emitted')
 *
 */




