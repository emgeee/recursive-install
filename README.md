recursive-ci [![Build Status](https://github.com/ReinoutW/recursive-ci.svg?branch=master)](https://github.com/ReinoutW/recursive-ci)
===

A small utility to recursively run `npm ci` in any child directory that have both a `package.json` as well as a `package-lock.json` file, excluding sub directories of `node_modules`.

Install
---
`$ npm i -g recursive-ci`

Usage
---
`$ npm-recursive-ci`

`$ npm-recursive-ci --skip-root` - Will not install in `process.cwd()`

`$ npm-recursive-ci --rootDir=lib` - Will only install from lib directory

`$ npm-recursive-ci --production` - Will not install dev dependencies


License
---
MIT
