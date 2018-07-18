var chainiumSdk = require('../src/index');
var wallet = chainiumSdk.crypto.generateWallet();
console.log(wallet);

var tx =
    '{' +
    '    SenderAddress: "CHLsVaYSPJGFi8BNGd6tP1VvB8UdKbVRDKD",' +
    '    Nonce: 1,' +
    '    Fee: 0.001,' +
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

var txRaw = chainiumSdk.crypto.utf8ToHex(tx);
var txBase64 = chainiumSdk.crypto.encode64(txRaw);

console.log('Tx:', txBase64);
console.log(chainiumSdk.crypto.signMessage(wallet.privateKey, txRaw));
