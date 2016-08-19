recursive-install [![Build Status](https://travis-ci.org/emgeee/recursive-install.svg?branch=master)](https://travis-ci.org/emgeee/recursive-install)
===

A small utility to recursively run `npm install` in any child directory that has a `package.json` file excluding sub directories of `node_modules`.

Install
---
`$ npm i -g recursive-install`

Usage
---
`$ recursive-install`

`$ recursive-install --skip-root` - Will not install in `process.cwd()`

License
---
MIT
