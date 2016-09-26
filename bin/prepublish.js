var rollup = require('rollup').rollup
var nodeResolve = require('rollup-plugin-node-resolve-auto')
var denodeify = require('denodeify')
var mkdirp = denodeify(require('mkdirp'))
var rimraf = denodeify(require('rimraf'))
var detective = require('detective')
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
        browser: false
      })
    ]
  })
}).then(function (bundle) {
  var code = bundle.generate({
    format: 'cjs'
  }).code
  var requires = detective(code)
}).catch(function (err) {
  console.error(err)
  console.error(err.stack)
  process.exit(1)
})
