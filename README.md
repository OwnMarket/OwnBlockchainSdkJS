# ChainiumSdkJS

Own Blockchain SDK for JavaScript


## Quick Start

```bash
$ git clone https://github.com/OwnMarket/OwnBlockchainSdkJS.git
$ cd OwnBlockchainSdkJS/Source
$ npm ci
```


Run tests:

```bash
$ npm test
```


## Usage

Chainium SDK for JS can be used in two scenarios:

- `own-blockchain-sdk` npm package
- `own-blockchain-sdk.js` standalone library


### NPM Package

Add package to the project:

```bash
$ npm install own-blockchain-sdk
```

Use the package in JS code:

```js
var ownSdk = require('own-blockchain-sdk');
var wallet = ownSdk.crypto.generateWallet();
console.log(wallet);
```

Sample output:

```
{ privateKey: '...',
  address: 'CH...' }
```


### Standalone Library

When `own-blockchain-sdk.js` library is referenced from the browser app,
it will create a global `ownBlockchainSdk` object, which contains all the SDK functionality in nested modules.

Examples of how to use the SDK can be found in the `demo` directory. Especially useful is the `browser-demo.html` file,
which shows how to generate private key and address pairs and sign transactions.


## Build Standalone Library

To build a standalone library for the browser, [Browserify](http://browserify.org) package is required:

```bash
$ sudo npm install -g browserify
```

Build is started using the `build.sh` script

```bash
$ ./build.sh
```

This results in `own-blockchain-sdk.js` file being created in `dist` directory.
