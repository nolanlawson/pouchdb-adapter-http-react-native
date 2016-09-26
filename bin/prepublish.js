var rollup = require('rollup').rollup
var nodeResolve = require('rollup-plugin-node-resolve')
var denodeify = require('denodeify')
var mkdirp = denodeify(require('mkdirp'))
var rimraf = denodeify(require('rimraf'))
var detective = require('detective')
var fs = require('fs')
var writeFile = denodeify(fs.writeFile)

Promise.resolve().then(function () {
  return rimraf('lib')
}).then(function () {
  return mkdirp('lib')
}).then(function () {
  return rollup({
    entry: './src/index.js',
    plugins: [
      nodeResolve({
        jsnext: true,
        browser: false,
        skip: [
          // TODO: use rollup-plugin-node-resolve-auto
          'debug', 'request', 'js-extend', 'spark-md5',
          'vuvuzela', 'argsarray', 'es6-promise-pool', 'lie', 'inherits'
        ]
      })
    ]
  })
}).then(function (bundle) {
  var code = bundle.generate({
    format: 'cjs'
  }).code
  var requires = detective(code)
  return Promise.all([
    fs.writeFile('lib/index.js', code, 'utf8'),
    fs.readFile('package.json', 'utf8').then(function (pkgJson) {
      var pkg = JSON.parse(pkgJson)
      // todo
    })
  ])
}).catch(function (err) {
  console.error(err)
  console.error(err.stack)
  process.exit(1)
})
