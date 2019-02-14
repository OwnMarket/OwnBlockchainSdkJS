var chainiumSdk = require('../src/index');
var networkCode = 'UNIT_TESTS';
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
console.log(chainiumSdk.crypto.signMessage(networkCode, wallet.privateKey, txRaw));

[
    "2C6sgXHMLkwiWeUK4fpyVFa3XG59MBa221pkW7kq2KB8",
    "3H2V8pM1h4wJEzCfuBHbNBC4w2FvXszKXx6nMEs3mUcC",
    "CpxNZ1YsPCmVrLwJzP7H88gHthSjBSySgVR3iK1c1VBk",
    "GzsiWSoVZtDKwGeLELjpqRW618eBsWmFxJhE2wobkzmP",
    "Ai6m6px88vHv9L3uVtqSGMRoRDatem7xYXdUyAgg7fon",
    "DdJtweNMxs6vfL3dGUMzZHM3GM7gi6RbGyHHwDcQaxXT",
    "9hYD2Xsky8PUpQStvE8UhPaHmhaqxhJth8VuQT5TDTjA",
    "AAscexBi2v8agKdHwbDgfiKzs9eMbH8JQQB3vzvx5k7X",
    "9exbLv213SGiHnSppnLYsRVTQqW96BHcMDg9ECZZEBCt",
    "AvLDKGB7SAqjjs4RhT87GCdBdxyyJHSqcALvWRrQnggd",
].forEach(function (pk) {
    var signature = chainiumSdk.crypto.signMessage(networkCode, pk, chainiumSdk.crypto.utf8ToHex('Chainium'));
    console.log(`"${pk}",\n    "${signature}"`);
});

[
    "2C6sgXHMLkwiWeUK4fpyVFa3XG59MBa221pkW7kq2KB8",
    "3H2V8pM1h4wJEzCfuBHbNBC4w2FvXszKXx6nMEs3mUcC",
    "CpxNZ1YsPCmVrLwJzP7H88gHthSjBSySgVR3iK1c1VBk",
    "GzsiWSoVZtDKwGeLELjpqRW618eBsWmFxJhE2wobkzmP",
    "Ai6m6px88vHv9L3uVtqSGMRoRDatem7xYXdUyAgg7fon",
    "DdJtweNMxs6vfL3dGUMzZHM3GM7gi6RbGyHHwDcQaxXT",
    "9hYD2Xsky8PUpQStvE8UhPaHmhaqxhJth8VuQT5TDTjA",
    "AAscexBi2v8agKdHwbDgfiKzs9eMbH8JQQB3vzvx5k7X",
    "9exbLv213SGiHnSppnLYsRVTQqW96BHcMDg9ECZZEBCt",
    "AvLDKGB7SAqjjs4RhT87GCdBdxyyJHSqcALvWRrQnggd",
].forEach(function (pk) {
    var address = chainiumSdk.crypto.addressFromPrivateKey(pk);
    console.log(`"${pk}", "${address}"`);
});
