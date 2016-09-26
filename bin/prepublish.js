var rollup = require('rollup').rollup
var nodeResolve = require('rollup-plugin-node-resolve-auto')
var denodeify = require('denodeify')
var mkdirp = denodeify(require('mkdirp'))
var rimraf = denodeify(require('rimraf'))
var detective = require('detective')
var builtins = require('builtin-modules')
var fs = require('fs')
var writeFile = denodeify(fs.writeFile)
var readFile = denodeify(fs.readFile)
var path = require('path')

Promise.resolve().then(function () {
  return rimraf('lib')
}).then(function () {
  return mkdirp('lib')
}).then(function () {
  return rollup({
    entry: './src/index.js',
    plugins: [
      nodeResolve({
        browser: false
      })
    ]
  })
}).then(function (bundle) {
  var code = bundle.generate({
    format: 'cjs'
  }).code
  var requires = detective(code)
  return Promise.all([
    writeFile('lib/index.js', code, 'utf8'),
    readFile('package.json', 'utf8').then(function (pkgJson) {
      var pkg = JSON.parse(pkgJson)
      pkg.dependencies = {}
      return Promise.all(requires.map(function (req) {
        if (builtins.indexOf(req) !== -1) {
          return
        }
        return readFile(path.join('node_modules', req, 'package.json'), 'utf8').then(function (otherPkg) {
          pkg.dependencies[req] = JSON.parse(otherPkg).version
        })
      })).then(function () {
        return writeFile('package.json', JSON.stringify(pkg, null, '  ') + '\n', 'utf8')
      })
    })
  ])
}).catch(function (err) {
  console.error(err)
  console.error(err.stack)
  process.exit(1)
})
