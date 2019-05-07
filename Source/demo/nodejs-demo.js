var ownBlockchainSdk = require('../src/index');
var networkCode = 'UNIT_TESTS';
var wallet = ownBlockchainSdk.crypto.generateWallet();

console.log(wallet);

var tx =
    '{' +
    '    SenderAddress: "CHLsVaYSPJGFi8BNGd6tP1VvB8UdKbVRDKD",' +
    '    Nonce: 1,' +
    '    ActionFee: 0.001,' +
    '    Actions: [' +
    '        {' +
    '            ActionType: "TransferChx",' +
    '            ActionData: {' +
    '                RecipientAddress: "CHfDeuB1y1eJnWd6aWfYaRvpS9Qgrh1eqe7",' +
    '                Amount: 1.5' +
    '            }' +
    '        }' +
    '    ]' +
    '}';

var txRaw = ownBlockchainSdk.crypto.utf8ToHex(tx);
var txBase64 = ownBlockchainSdk.crypto.encode64(txRaw);

console.log('Tx:', txBase64);
console.log(ownBlockchainSdk.crypto.signMessage(networkCode, wallet.privateKey, txRaw));

console.log('Addresses:');
[
    "B6WNNx9oK8qRUU52PpzjXHZuv4NUb3Z33hdju3hhrceS",
    "BYeryGRWErwcHD6MDPYeUpYBH5Z2viXSDS827hPMmVvU",
    "3uwbboWnx2BGcWGBASXQ6AAzooi4xKA6fV3psPgvt8Ja",
    "3UtEGN2Wbmm5jVE3W5iFgeCw9NJ5AueFTqfWcPbdFGMk",
    "7hYZ9bHuhbJZcGhPzxeRdFYVr24DFMExduLgcqF1U4k8",
    "Hg4GsWvBDKxdZ76dYmjm6L39JoukD23acQS2KA7eoGLy",
    "2bnW9tKokbneHvUzZ6SaUkwM8XwudDxdyWr6FnLtCHnT",
    "BENFVdPfpb8e1jRKZkf7Wmo4Re71qg1Xzfu5cH73JFWG",
    "ZXXkM41yHhkzb2k5KjeWuGCzYj7AXAfJdMXqKM4TGKq",
    "BFRzCfhZFBq2mBtSSXz27i3SdNsPh4FtHe9QLeZchySg",
].forEach(function (pk) {
    var address = ownBlockchainSdk.crypto.addressFromPrivateKey(pk);
    console.log(`"${pk}", "${address}"`);
});

console.log('Signatures:');
[
    "B6WNNx9oK8qRUU52PpzjXHZuv4NUb3Z33hdju3hhrceS",
    "BYeryGRWErwcHD6MDPYeUpYBH5Z2viXSDS827hPMmVvU",
    "3uwbboWnx2BGcWGBASXQ6AAzooi4xKA6fV3psPgvt8Ja",
    "3UtEGN2Wbmm5jVE3W5iFgeCw9NJ5AueFTqfWcPbdFGMk",
    "7hYZ9bHuhbJZcGhPzxeRdFYVr24DFMExduLgcqF1U4k8",
    "Hg4GsWvBDKxdZ76dYmjm6L39JoukD23acQS2KA7eoGLy",
    "2bnW9tKokbneHvUzZ6SaUkwM8XwudDxdyWr6FnLtCHnT",
    "BENFVdPfpb8e1jRKZkf7Wmo4Re71qg1Xzfu5cH73JFWG",
    "ZXXkM41yHhkzb2k5KjeWuGCzYj7AXAfJdMXqKM4TGKq",
    "BFRzCfhZFBq2mBtSSXz27i3SdNsPh4FtHe9QLeZchySg",
].forEach(function (pk) {
    var signature = ownBlockchainSdk.crypto.signMessage(networkCode, pk, ownBlockchainSdk.crypto.utf8ToHex('Chainium'));
    console.log(`"${pk}",\n    "${signature}"`);
});
