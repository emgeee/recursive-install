#!/usr/bin/env node

var path = require('path')
var shell = require('shelljs')

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
  shell.cd(dir)
  console.log('Installing ' + dir + '/package.json...')
  var result = shell.exec('npm install')
  console.log('')

  return {
    dirname: dir,
    exitCode: result.code
  }
}

if (require.main === module) {
  var exitCode = getPackageJsonLocations(process.cwd())
    .map(npmInstall)
    .reduce(function (code, result) {
      return result.exitCode > code ? result.exitCode : code
    }, 0)

  process.exit(exitCode)
}

