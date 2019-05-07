set SCRIPT_DIR="%~dp0"

pushd "%SCRIPT_DIR%"
browserify ./src/browser.js -o ./dist/own-blockchain-sdk.js
popd
