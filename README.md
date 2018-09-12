# ChainiumSdkJS

Chainium SDK for JavaScript


## Quick Start

```bash
$ git clone https://github.com/Chainium/ChainiumSdkJS.git
$ cd ChainiumSdkJS/Source
$ npm ci
```


Run tests:

```bash
$ npm test
```


## Build

To build a self-contained library for the browser, [Browserify](http://browserify.org) package is required:

```bash
$ sudo npm install -g browserify
```

Build is started using the `build.sh` script

```bash
$ ./build.sh
```

This results in `chainium-sdk.js` file being created in `dist` directory.


## Usage

Chainium SDK for JS can be used in two scenarios:

- `chainium-sdk.js` standalone library
- `chainium-sdk` nodejs module (coming soon)

### Standalone library

When `chainium-sdk.js` library is referenced from the browser app, it will create a global `chainiumSdk` object,
which contains all the SDK functionality in nested modules.

Examples of how to use the SDK can be found in the `demo` directory. Especially useful is the `browser-demo.html` file,
which shows how to generate private key and address pairs and sign transactions.
