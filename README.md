# OwnBlockchainSdkJS

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

Own Blockchain SDK for JS can be used in two scenarios:

- `own-blockchain-sdk` npm package
- `own-blockchain-sdk.js` standalone library


### NPM Package

Add [package](https://www.npmjs.com/package/own-blockchain-sdk) to the project:

```bash
$ npm install own-blockchain-sdk
```

Use the package in JS code:

```js
var ownSdk = require('own-blockchain-sdk');
var networkCode = 'OWN_PUBLIC_BLOCKCHAIN_TESTNET';

// Create a new wallet
var wallet = ownSdk.crypto.generateWallet();
console.log(wallet);

// Compose a transaction with nonce = 1 and actionFee = 0.1
var tx = ownSdk.transactions.createTx(wallet.address, 1, 0.1);
tx.addTransferChxAction('CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 100); // Transfer 100 CHX to CHxxx... address.

// Look at the raw transaction in JSON format
console.log(tx.toJson(4));

// Sign the transaction for submission to node API on TestNet
console.log(tx.sign(networkCode, wallet.privateKey));
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

Build is started using the `build.sh` script (`build.bat` for Windows):

```bash
$ ./build.sh
```

This results in `own-blockchain-sdk.js` file being created in `dist` directory.
