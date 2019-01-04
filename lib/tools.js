// tools.js
// ========

var path = require('path');
var shell = require('shelljs');

module.exports = function() {
  this.noop = function(x) {
    return x;
  };

  this.getPackageJsonLocations = function(dirname) {
    return getPackageFileLocations(dirname, 'package.json');
  };

  this.getPackageLockJsonLocations = function(dirname) {
    return getPackageFileLocations(dirname, 'package-lock.json');
  };

  this.filterRoot = function(dir) {
    if (path.normalize(dir) === path.normalize(process.cwd())) {
      console.log('Skipping root package-json & package-lock.json');
      return false;
    } else {
      return true;
    }
  };

  function getPackageFileLocations(dirname, filename) {
    return shell.find(dirname)
                .filter(function (fname) {
                  return !(fname.indexOf('node_modules') > -1 || fname[0] === '.') &&
                    path.basename(fname) === filename;
                })
                .map(function (fname) {
                  return path.dirname(fname);
                });
  }
};

