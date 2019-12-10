var ownBlockchainSdk = require('../src/index');

var networkCode = 'UNIT_TESTS';
var wallet = ownBlockchainSdk.crypto.generateWallet();
console.log('WALLET:', wallet);

var tx = ownBlockchainSdk.transactions.createTx(wallet.address, 1, 0.1);
tx.addTransferChxAction('CHexBLbHxh8DqnDcFjLRkaYCneiG9h7XVWq', 1.5);
console.log('JSON:', tx.toJson(4)); // Pretty-printing with 4 space indentation.
console.log('SIGNED:', tx.sign(networkCode, wallet.privateKey));
