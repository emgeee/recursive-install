#!/usr/bin/env node

require( __dirname + '/lib/tools.js')();

var execSync = require('child_process').execSync;
var argv = require('yargs').argv;

function npmCi (dir) {
  var exitCode = 0;
  try {
    if(argv.production) {
      console.log('Installing [ci] ' + dir + '/package-lock.json with --only=production option');
      execSync('npm ci --only=production', { cwd: dir});
    } else {
      console.log('Installing [ci] ' + dir + '/package-lock.json');
      execSync('npm ci', { cwd: dir});
    }
    console.log('');
  } catch (err) {
    exitCode = err.status;
  }

  return {
    dirname: dir,
    exitCode: exitCode
  };
}

if (require.main === module) {
  var exitCode = getPackageLockJsonLocations(argv.rootDir ? argv.rootDir : process.cwd())
    .filter(argv.skipRoot ? filterRoot : noop)
    .map(npmCi)
    .reduce(function (code, result) {
      return result.exitCode > code ? result.exitCode : code;
    }, 0);

  process.exit(exitCode);
}
