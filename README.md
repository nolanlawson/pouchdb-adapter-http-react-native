pouchdb-adapter-http-react-native
==============

Build of `pouchdb-adapter-http` optimized for `pouchdb-react-native`. In particular, it contains
only the Node version, not the browser version (because that's what `pouchdb-react-native` uses).

Usage
---

    npm install pouchdb-adapter-http-react-native

```js
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-adapter-http-react-native'));
```
