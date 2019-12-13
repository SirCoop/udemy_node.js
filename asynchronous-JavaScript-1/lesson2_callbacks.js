// Callback Hell (an abstracted version)

console.log('Before');
getUser(1, displayUserInformation);
console.log('After');

function getUser(id, callback) {
  setTimeout(() => {
    console.log('Reading a user from a database...');
    callback({ id: id, githubUsername: 'cooper'})
  }, 2000);
}

function getRepositories(username, callback) {
  setTimeout(() => {
    console.log('Calling GitHub API...');
    callback(['repo1', 'repo2', 'repo3']);
  }, 2000);
}

function getCommits(repo, callback) {
  setTimeout(() => {
    console.log('Getting Commits...');
    callback(['commit1', 'commit2', 'commit3']);
  }, 2000);
}

function displayUserInformation(user) {
  console.log('User: ', user);
  getRepositories(user.githubUsername, displayUserRepos);
}

function displayUserRepos(repos) {
  console.log('Repos: ', repos);
  getCommits(repos[0], displayUserCommits);
}

function displayUserCommits(commits) {
  console.log('Commits: ', commits);
}



