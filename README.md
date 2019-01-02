recursive-install [![Build Status](https://github.com/ReinoutW/recursive-ci.svg?branch=master)](https://github.com/ReinoutW/recursive-ci)
===

A small utility to recursively run `npm ci` in any child directory that has a `package.json` file excluding sub directories of `node_modules`.

Install
---
`$ npm i -g recursive-ci`

Usage
---
`$ npm-recursive-ci`

`$ npm-recursive-ci --skip-root` - Will not install in `process.cwd()`
`$ npm-recursive-ci --rootDir=lib` - Will only install from lib directory


License
---
MIT
