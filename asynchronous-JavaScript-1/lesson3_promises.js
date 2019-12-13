/** A javascript object that holds the eventual result of an asynchronous operation
 * It promises that it will give you the result of an asynchronous operation
 * 
 * States:
 * 
 * 1) Pending
 * 2) Fulfilled
 * 3) Rejected
 */

 /** any async function that takes a callback should be modified to return a promise */

 const p_resolve = new Promise((resolve, reject) => {
   // Kick off some async work
   // ... access db, call a web service, start a timer
   console.log('Start async 1');
   setTimeout(() => {
    console.log('Doing async 1');
    resolve(1); // pending => resolved, fulfilled
   }, 2000);
   // reject(new Error('message'));
 });

 p_resolve.then(result => console.log('Result: ', result));

 const p_reject = new Promise((resolve, reject) => {
  console.log('Start async 2');
  setTimeout(() => {
   console.log('Doing async 2');
   reject(new Error('async 2 fail')); // pending => rejected
  }, 2000);
});

// consume the promise
p_reject
  .then(result => console.log('Result: ', result))
  .catch(err => console.log('Error: ', err.message));
