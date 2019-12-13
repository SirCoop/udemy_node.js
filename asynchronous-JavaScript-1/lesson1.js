console.log('Before');
const user = getUser(1); // will be undefined because the setTimeout has yet to run
console.log(user);
console.log('After');

function getUser(id) {
  setTimeout(() => {
    console.log('Reading a user from a database...');
    return ({ id: id, githubUsername: 'cooper'});
  }, 2000);
}

/**
 * 3 patterns to deal with asynchronous code
 * 
 * 1) Callbacks
 * 2) Promises
 * 3) Async/Await
 */