// Chained promises to implement a complex async operation

console.log('Before');
getUser(1)
  .then(user => getRepositories(user.githubUsername))
  .then(repos => getCommits(repos[0]))
  .then(commits => console.log('Commits: ', commits))
  .catch(err => console.log('Error: ', err.message)); // single error handler for all async operations
console.log('After');

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
      resolve(['repo1', 'repo2', 'repo3']);
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
