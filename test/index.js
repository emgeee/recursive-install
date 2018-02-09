var path = require('path')
var assert = require('assert')
var uuidv4 = require('uuid/v4')
var fs = require('fs-extra')
var os = require('os')
var execSync = require('child_process').execSync


var script = path.join(__dirname, '../recursive-install.js')

describe('recursive install', function () {
  var cwd
  var installedPaths
  var notInstalledPaths
  var result = {code: 0}

  beforeEach(function () {
    installedPaths = [
      '.',
      '/hello/world',
      '/foo/bar'
    ]

    notInstalledPaths = [
      '/notInstalledPaths/node_modules/a-module'
    ]

    cwd = path.join(os.tmpdir(), 'recursive-install'.concat(uuidv4()))
    fs.ensureDirSync(cwd)

    installedPaths.concat(notInstalledPaths).forEach(function (p) {
      var newPath = path.join(cwd, p)
      fs.ensureDirSync(newPath)
      fs.copySync(path.join(__dirname, 'test-package.json'), path.join(newPath, 'package.json'))
    })
  })

  afterEach(function () {
    if (fs.lstatSync(cwd).isDirectory()) {
      fs.removeSync(cwd)
    }
  })

  describe('test without option', function () {
    beforeEach(function (done) {
      this.timeout(60000) // update timeout in case npm install take time
      try {
        execSync(script, { cwd: cwd }) // Throw an error if exec fail
        done()
      } catch (err) {
        done(err)
      }
    })

    it('installs all packages', function () {
      installedPaths.forEach(function (p) {
        var workingDir = path.join(cwd, p)
        assert(
          fs.lstatSync(path.join(workingDir, 'node_modules')).isDirectory(),
          'Failed to install for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )

        assert(
          fs.lstatSync(path.join(workingDir, 'node_modules', 'right-pad')).isDirectory(),
          'Failed to install dev dependencies for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )
      })
    })

    it('doesn\'t install packages in node_modules', function () {
      notInstalledPaths.forEach(function (p) {
        var workingDir = path.join(cwd, p)
        assert(
          !fs.existsSync(path.join(workingDir, 'node_modules')),
          'Install incorrectly succeeded for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )
      })
    })
  })

  describe('test with option --production', function () {
    beforeEach(function (done) {
      this.timeout(60000) // update timeout in case npm install take time
      try {
        execSync(script.concat(' --production'), { cwd: cwd }) // Throw an error if exec fail
        done()
      } catch (err) {
        done(err)
      }
    })

    it('installs packages, but not devDependencies', function () {
      installedPaths.forEach(function (p) {
        var workingDir = path.join(cwd, p)
        assert(
          fs.lstatSync(path.join(workingDir, 'node_modules')).isDirectory(),
          'Failed to install for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )

        assert(
          !fs.existsSync(path.join(workingDir, 'node_modules', 'right-pad')),
          'Should not install dev dependencies for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )
      })
    })

    it('doesn\'t install packages in node_modules', function () {
      notInstalledPaths.forEach(function (p) {
        var workingDir = path.join(cwd, p)
        assert(
          !fs.existsSync(path.join(workingDir, 'node_modules')),
          'Install incorrectly succeeded for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )
      })
    })
  })

  describe('test with option --skip-root', function () {
    beforeEach(function (done) {
      this.timeout(60000) // update timeout in case npm install take time
      try {
        execSync(script.concat(' --skip-root'), { cwd: cwd }) // Throw an error if exec fail
        done()
      } catch (err) {
        done(err)
      }
    })

    it('installs packages, but not in root directory', function () {
      assert(
        !fs.existsSync(path.join(cwd, 'node_modules')),
        'Should not install dependencies for root directory ' + cwd + '. Directory Listing: ' + fs.readdirSync(cwd)
      )
    })

    it('doesn\'t install packages in node_modules', function () {
      notInstalledPaths.forEach(function (p) {
        var workingDir = path.join(cwd, p)
        assert(
          !fs.existsSync(path.join(workingDir, 'node_modules')),
          'Install incorrectly succeeded for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )
      })
    })
  })

  describe('test with options --skip-root --production', function () {
    beforeEach(function (done) {
      this.timeout(60000) // update timeout in case npm install take time
      try {
        execSync(script.concat(' --skip-root --production'), { cwd: cwd }) // Throw an error if exec fail
        done()
      } catch (err) {
        done(err)
      }
    })

    it('installs packages, but not in root directory', function () {
      assert(
        !fs.existsSync(path.join(cwd, 'node_modules')),
        'Should not install dependencies for root directory ' + cwd + '. Directory Listing: ' + fs.readdirSync(cwd)
      )

      installedPaths.shift() // Remove root from installedPaths
      installedPaths.forEach(function (p) {
        var workingDir = path.join(cwd, p)
        assert(
          fs.lstatSync(path.join(workingDir, 'node_modules')).isDirectory(),
          'Failed to install for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )

        assert(
          !fs.existsSync(path.join(workingDir, 'node_modules', 'right-pad')),
          'Should not install dev dependencies for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )
      })
    })

    it('doesn\'t install packages in node_modules', function () {
      notInstalledPaths.forEach(function (p) {
        var workingDir = path.join(cwd, p)
        assert(
          !fs.existsSync(path.join(workingDir, 'node_modules')),
          'Install incorrectly succeeded for ' + workingDir + '. Directory Listing: ' + fs.readdirSync(workingDir)
        )
      })
    })
  })

  describe('test with fail', function () {
    it('fails to install packages', function (done) {
      cwd = path.join(os.tmpdir(), 'recursive-install'.concat(uuidv4()))
      fs.ensureDirSync(cwd)
      fs.copySync(path.join(__dirname, 'test-package-fail.json'), path.join(cwd, 'package.json'))

      try {
        execSync(script, { cwd: cwd }) // Throw an error if exec fail
        done('Should not succeed')
      } catch (err) {
        assert(
          (err.status === 1),
          'Exist status should be 1, not '+ err.status
        )
        done()
      }
    })
  })
})
