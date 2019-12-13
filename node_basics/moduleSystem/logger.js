  const url = 'http://mylogger.io/log';

  const log = (message) => {
    // send an HTTP request
    console.log('message: ', message);
  };

  const anotherFunc = (message) => {
    // send an HTTP request
    console.log('another message: ', message);
  };

  const viewModuleInfo = () => {
    console.log('exports: ', exports)
    console.log('require: ', require)
    console.log('module: ', module)
    console.log('__filename: ', __filename)
    console.log('__dirname: ', __dirname)
  }

  module.exports = {
    log,
    anotherFunc,
    viewModuleInfo
  };

  /**
   * In actuality, when a module is imported for use,
   * it is an IIFE with five default arguments listed below
   * 
    (function (exports, require, module, __filename, __dirname) {
    ...do stuff
    })
   */

