#!/bin/bash

SCRIPT_DIR="${0%/*}"

pushd "$SCRIPT_DIR"
browserify ./src/browser.js -o ./dist/own-blockchain-sdk.js
popd
