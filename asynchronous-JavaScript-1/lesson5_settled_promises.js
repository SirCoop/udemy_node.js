/** sometimes you want to create a promise that has already resolved
 * e.g. Unit Tests
 */

 const p1 = Promise.resolve({ id: 1 });
 p1.then(res => console.log('res 1: ', res));

 /** when rejecting promises, always use an error object. otherwrise, 
  * you won't get the full call stack in the error
  */
 const p2 = Promise.reject(new Error('reason for rejection...'));
 p2.catch(res => console.log('res 2: ', res));