const logger = require('./logger');
console.log(logger)
logger.viewModuleInfo()

// provide information about the path of the module
const path = require('path'); // if no relative path, node assumes its a built-in module
const pathObj = path.parse(__filename);
console.log(pathObj)

