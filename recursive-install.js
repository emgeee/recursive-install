#!/usr/bin/env node

var path = require('path')
var shell = require('shelljs')
var execSync = require('child_process').execSync
var argv = require('yargs').argv

function noop (x) { return x }

function getPackageJsonLocations (dirname) {
  return shell.find(dirname)
    .filter(function (fname) {
      return !(fname.indexOf('node_modules') > -1 || fname[0] === '.') &&
        path.basename(fname) === 'package.json'
    })
    .map(function (fname) {
      return path.dirname(fname)
    })
}

function npmInstall (dir) {
  var exitCode = 0;
  try {
    if(argv.production) {
      console.log('Installing ' + dir + '/package.json with --production option')
      execSync('npm install --production', { cwd: dir})
    } else {
      console.log('Installing ' + dir + '/package.json')
      execSync('npm install', { cwd: dir})
    }
    console.log('')
  } catch (err) {
    exitCode = err.status
  }

  return {
    dirname: dir,
    exitCode: exitCode
  }
}

function filterRoot (dir) {
  if (path.normalize(dir) === path.normalize(process.cwd())) {
    console.log('Skipping root package.json')
    return false
  } else {
    return true
  }
}

if (require.main === module) {
  var exitCode = getPackageJsonLocations(argv.rootDir ? argv.rootDir : process.cwd())
    .filter(argv.skipRoot ? filterRoot : noop)
    .map(npmInstall)
    .reduce(function (code, result) {
      return result.exitCode > code ? result.exitCode : code
    }, 0)

  process.exit(exitCode)
}
