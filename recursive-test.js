#!/usr/bin/env node
var argv = require('yargs').argv
var recursive = require('./recursive');
var getPackageJsonLocations = recursive.getPackageJsonLocations;
var filterRoot = recursive.filterRoot;
var npmTest = recursive.npmTest;

function noop (x) { return x }

if (require.main === module) {
  var exitCode = getPackageJsonLocations(process.cwd())
    .filter(argv.skipRoot ? filterRoot : noop)
    .map(npmTest)
    .reduce(function (code, result) {
      return result.exitCode > code ? result.exitCode : code
    }, 0)

  process.exit(exitCode)
}
