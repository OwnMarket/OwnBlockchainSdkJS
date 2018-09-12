#!/bin/bash

SCRIPT_DIR="${0%/*}"

pushd "$SCRIPT_DIR"
browserify ./src/browser.js -o ./dist/chainium-sdk.js
popd
