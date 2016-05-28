var path = require('path')
var shell = require('shelljs')
var assert = require('assert')

var script = path.join(__dirname, '../recursive-install.js')

describe('recursive install', function () {
  var cwd = path.join(shell.tempdir(), 'recursive-install')
  var installedPaths = [
    '.',
    '/hello/world',
    '/foo/bar'
  ]

  var notInstalledPaths = [
    '/node_modules/a-module'
  ]

  if (shell.test('-d', cwd)) shell.rm('-r', cwd)
  shell.mkdir(cwd)

  installedPaths.concat(notInstalledPaths).forEach(function (p) {
    var newPath = path.join(cwd, p)
    shell.mkdir('-p', newPath)
    shell.cp(__dirname + '/test-package.json', newPath + '/package.json')
  })

  shell.cd(cwd)

  var result = shell.exec(script)

  it('exits with code 0', function () {
    assert.strictEqual(result.code, 0)
  })

  it('installs packages', function () {
    installedPaths.forEach(function (p) {
      var workingDir = path.join(cwd, p)
      assert(
        shell.test('-d', workingDir + '/node_modules'),
        'Failed to install for ' + workingDir + '. Directory Listing: ' + shell.ls(workingDir)
      )
    })
  })

  it('doesn\'t install packages in node_modules', function () {
    notInstalledPaths.forEach(function (p) {
      var workingDir = path.join(cwd, p)
      assert(
        !shell.test('-d', workingDir + '/node_modules'),
        'Install incorrectly succeeded for ' + workingDir + '. Directory Listing: ' + shell.ls(workingDir)
      )
    })
  })
})
