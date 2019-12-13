module.exports.add = function(a,b) {return a + b}
module.exports.multiply = function(a,b) {return a * b}


/**
  npm publish -> to publish package

  Note: 
  Package must have unique name
  Change name in package.json to make unique and re-run "npm publish"
 */

 /**
    Update package

    npm version <type> | major, minor, patch
    e.g. npm version minor -> automatically updates package.json version

    npm publish -> pushes updated to npm
  */