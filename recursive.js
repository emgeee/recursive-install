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

function npmTest (dir) {
  shell.cd(dir)
  console.log('Running tests for ' + dir + '/package.json...')
  var result = shell.exec('npm test')
  console.log('')

  return {
    dirname: dir,
    exitCode: result.code
  }
}

function filterRoot (dir) {
  if (path.normalize(dir) === path.normalize(process.cwd())) {
    console.log('Skipping root package.json...')
    return false
  } else {
    return true
  }
}

module.exports = {
  getPackageJsonLocations: getPackageJsonLocations,
  npmInstall: npmInstall,
  npmTest: npmTest,
  filterRoot: filterRoot
};
