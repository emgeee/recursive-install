#!/usr/bin/env node

require( __dirname + '/lib/tools.js')();

var execSync = require('child_process').execSync;
var argv = require('yargs').argv;

function npmInstall (dir) {
  var exitCode = 0;
  try {
    if(argv.production) {
      console.log('Installing ' + dir + '/package.json with --production option');
      execSync('npm install --production', { cwd: dir});
    } else {
      console.log('Installing ' + dir + '/package.json');
      execSync('npm install', { cwd: dir});
    }
    console.log('')
  } catch (err) {
    exitCode = err.status;
  }

  return {
    dirname: dir,
    exitCode: exitCode
  };
}

if (require.main === module) {
  var exitCode = getPackageJsonLocations(argv.rootDir ? argv.rootDir : process.cwd())
    .filter(argv.skipRoot ? filterRoot : noop)
    .map(npmInstall)
    .reduce(function (code, result) {
      return result.exitCode > code ? result.exitCode : code;
    }, 0);

  process.exit(exitCode);
}
