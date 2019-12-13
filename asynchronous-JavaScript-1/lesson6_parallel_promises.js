const path = require('path'); // if no relative path, node assumes its a built-in module
const pathObj = path.parse(__filename);
console.log('path: ', pathObj.base);

const p1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 1...');
    resolve(1);
  }, 2000);
});

const p2 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 2...');
    resolve(2);
  }, 6000);
});

Promise.all([p1, p2])
  .then(result => console.log('Result 1: ', result));

// what if one promise fails?

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('Async operation 3...');
    const error = new Error('Because something failed.');
    error.fileName = pathObj.base;
    error.lineNumber = 'some lineNumber';
    reject(error);
  }, 2000);
});

const p4 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 4...');
    resolve(4);
  }, 6000);
});

Promise.all([p3, p4])
  .then(result => console.log('Result 2: ', result))
  .catch(error => console.log('Error 2: ', error.message, error.fileName, error.lineNumber));

// Execute a function after one promise returns, but before all return
// The value of the result in Promise.race will be the result of the first fulfilled promise, not an array of both
// change timeout values to see which resolves first
const p5 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 5...');    
    resolve(5);
  }, 2000);
});

const p6 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('Async operation 6...');
    resolve(6);
  }, 1000);
});

Promise.race([p5, p6])
  .then(result => console.log('Result 3: ', result))
  .catch(error => console.log('Error 3: ', error.message, error.name));
  