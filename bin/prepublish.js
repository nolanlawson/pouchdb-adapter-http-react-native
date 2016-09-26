var denodeify = require('denodeify')
var ncp = denodeify(require('ncp'))
var rimraf = denodeify(require('rimraf'))
Promise.resolve().then(function () {
  return rimraf('lib')
}).then(function () {
  return ncp('node_modules/pouchdb-adapter-http/lib', 'lib')
}).catch(function (err) {
  console.error(err)
  console.error(err.stack)
  process.exit(1)
})
