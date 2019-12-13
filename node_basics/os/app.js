const os = require('os');

const total = os.totalmem();
const free = os.freemem();

console.log(`Total memory: ${total}`);
console.log(`Free memory: ${free}`);
