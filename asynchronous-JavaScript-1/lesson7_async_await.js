/** 
 * Anytime a function returns a promise, you can await the result
 * Anytime await is used, there must be an enclosing function decorated with async
 * 
 * Async/Await is syntactical sugar built on top of Promises
 * 
 * Under the hood, async/await is converted to Promise.then, Promise.catch
 * 
 * Code still runs asynchronously, but it looks and feels synchronous
 * 
 * Async/Await does not have a 'catch' intrinsically like Promises do, therefore use try/catch
 * */
async function displayCommits() {
  try {
    // async code that looks like synchronous code
    const user = await getUser(1);
    const repos = await getRepositories(user.githubUsername);
    const commits = await getCommits(repos[0]);
    console.log('Commits: ', commits); 
  } catch (error) {
    console.log('Error: ', error.message);
  }  
}

/** run displayCommits to observe async/await */
displayCommits();

function getUser(id) {
  return new Promise((resolve, reject) => {
    // Kick off async work
    setTimeout(() => {
      console.log('Reading a user from a database...');
      resolve({ id: id, githubUsername: 'cooper'});
    }, 2000);
  });
}

function getRepositories(username) {
  return new Promise((resolve, reject) => {
    // Kick off async work
    setTimeout(() => {
      console.log(`Calling GitHub API for ${username}...`);
      // resolve(['repo1', 'repo2', 'repo3']);
      reject(new Error('Could not get repos.'));
    }, 2000);
  });
}

function getCommits(repo) {
  return new Promise((resolve, reject) => {
    // Kick off async work
    setTimeout(() => {
      console.log(`Calling Commits for ${repo}...`);
      resolve(['commit1', 'commit2', 'commit3']);
    }, 2000);
  });
}