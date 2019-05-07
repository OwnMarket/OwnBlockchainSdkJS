(function () {
    'use strict';

    var CryptoJS = require('crypto-js');
    var Base58 = require('bs58');
    var EC = require('elliptic').ec;
    var Bip32 = require('bip32');
    var Bip39 = require('bip39');
    var Crypto = require('crypto');

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Encryption
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function encrypt(text, password) {
        return CryptoJS.AES.encrypt(text, password).toString();
    }

    function decrypt(text, password) {
        return CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Encoding
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function utf8ToHex(str) {
        return CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Utf8.parse(str)
        );
    }

    function encode64(hexData) {
        return CryptoJS.enc.Base64.stringify(
            CryptoJS.enc.Hex.parse(hexData)
        );
    }

    function decode64(base64Data) {
        return CryptoJS.enc.Hex.stringify(
            CryptoJS.enc.Base64.parse(base64Data)
        );
    }

    function encode58(hexData) {
        return Base58.encode(Buffer.from(hexData, 'hex'));
    }

    function decode58(base58Data) {
        return Base58.decode(base58Data).toString('hex');
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Hashing
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function sha256(hexData) {
        var result = CryptoJS.enc.Hex.stringify(
            CryptoJS.SHA256(
                CryptoJS.enc.Hex.parse(hexData)
            )
        );
        if (result.length != 64)
            throw `[SHA256] invalid hex encoded length: Expected 64, got ${result.length}`;

        return result;
    }

    function sha512(hexData) {
        var result = CryptoJS.enc.Hex.stringify(
            CryptoJS.SHA512(
                CryptoJS.enc.Hex.parse(hexData)
            )
        );
        if (result.length != 128)
            throw `[SHA512] invalid hex encoded length: Expected 128, got ${result.length}`;

    return result;
    }

    function sha160(hexData) {
        return sha512(hexData).substr(0, 40); // First 20 bytes.
    }

    function hash(hexData) {
        return encode58(sha256(hexData));
    }

    function deriveHash(address, nonce, txActionNumber) {
        var addressHex = decode58(address)
        if (addressHex.length != 52)
            throw `Invalid blockchain address: ${addressHex}`;

        var nonceHex = nonce.toString(16).padStart(16, '0');
        var txActionNumberHex = txActionNumber.toString(16).padStart(4, '0');
        return hash(addressHex + nonceHex + txActionNumberHex);
    }

    function blockchainAddress(hexPublicKey) {
        var prefix = '065A';
        var publicKeyHashWithPrefix = prefix + sha160(sha256(hexPublicKey));
        var checksum = sha256(sha256(publicKeyHashWithPrefix)).substr(0, 8); // First 4 bytes.
        return encode58(publicKeyHashWithPrefix + checksum);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Signing
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    var ec = new EC('secp256k1');

    function walletFromKeyPair(keyPair) {
        return {
            privateKey: encode58(keyPair.getPrivate('hex').padStart(64, '0')),
            address: blockchainAddress(keyPair.getPublic('hex'))
        };
    }

    function generateWallet() {
        var keyPair = ec.genKeyPair();
        return walletFromKeyPair(keyPair);
    }

    function addressFromPrivateKey(privateKey) {
        var decodedPrivateKey = decode58(privateKey)
        if (decodedPrivateKey.length != 64)
            throw 'Invalid private key'
        var keyPair = ec.keyFromPrivate(decode58(privateKey), 'hex');
        return blockchainAddress(keyPair.getPublic('hex'));
    }

    function signData(privateKey, dataToSign) {
        var signature = ec.sign(dataToSign, decode58(privateKey), 'hex', {canonical: true});
        var signatureBytes =
            signature.r.toString('hex').padStart(64, '0')   // R
            + signature.s.toString('hex').padStart(64, '0') // S
            + '0' + signature.recoveryParam                 // V
        return encode58(signatureBytes);
    }

    function signMessage(networkCode, privateKey, hexMessage) {
        var messageHash = sha256(hexMessage);
        var networkId = sha256(utf8ToHex(networkCode));
        var dataToSign = sha256(messageHash + networkId);
        return signData(privateKey, dataToSign);
    }

    function signPlainText(privateKey, textMessage) {
        var dataToSign = sha256(utf8ToHex(textMessage));
        return signData(privateKey, dataToSign);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Hierarchical Deterministic Cryptography
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const wordsEN = require('./english.json');
    const bip44RegistrationIndex = 25718;

    function validateMnemonic(mnemonic) {
        return Bip39.validateMnemonic(mnemonic, wordsEN);
    }

    function generateMnemonic() {
        var  randomBytes = Crypto.randomBytes(32); // 256 bits
        return Bip39.entropyToMnemonic(randomBytes.toString('hex'), wordsEN); // 24 word phrase
    }

    function generateSeedFromMnemonic(mnemonic, passphrase) {
        if (validateMnemonic(mnemonic)) {
            return Bip39.mnemonicToSeedSync(mnemonic, passphrase).toString('hex');
        }
        else {
            throw 'Invalid mnemonic';
        }
    }

    function generateSeed(passphrase) {
        var mnemonic = generateMnemonic();
        return generateSeedFromMnemonic(mnemonic, passphrase);
    }

    function generateMasterNodeFromSeed(seed) {
        return Bip32.fromSeed(Buffer.from(seed, 'hex'));
    }

    function generateMasterNodeFromMnemonic(mnemonic, passphrase) {
        if (validateMnemonic(mnemonic)) {
            var seed = generateSeedFromMnemonic(mnemonic, passphrase);
            return generateMasterNodeFromSeed(seed);
        }
        else {
            throw 'Invalid mnemonic';
        }
    }

    function generateMasterNode(passphrase) {
        var mnemonic = generateMnemonic();
        return generateMasterNodeFromMnemonic(mnemonic, passphrase);
    }

    function generateWalletFromSeed(seed, index) {
        if (index < 1) throw 'HD wallets must be derived with index > 0';
        var masterNode = generateMasterNodeFromSeed(seed);
        var childNode = masterNode.derivePath(`m/44'/${bip44RegistrationIndex}'/0'/0/${index}`);
        var keyPair = ec.keyFromPrivate(childNode.privateKey);
        return walletFromKeyPair(keyPair);
    }

    function generateWalletKeystore(mnemonic, password) {
        if (validateMnemonic(mnemonic)) {
            return encrypt(mnemonic, password);
        }
        else {
            throw 'Invalid mnemonic';
        }
    }

    function generateSeedFromKeyStore(keyStoreEncrypted, password) {
        var mnemonic = decrypt(keyStoreEncrypted, password);
        if (validateMnemonic(mnemonic)) {
            return generateSeedFromMnemonic(mnemonic, password);
        }
        else {
            throw 'Invalid keystore';
        }
    }

    function restoreWalletsFromSeed(seed, walletCount) {
        var wallets = [];
        for (let i = 1; i <= walletCount; i ++) {
            var wallet = generateWalletFromSeed(seed, i);
            wallets.push(wallet);
        }

        return wallets;
    }

    module.exports = {
        // Encryption
        encrypt: encrypt,
        decrypt: decrypt,

        // Encoding
        utf8ToHex: utf8ToHex,
        encode64: encode64,
        decode64: decode64,
        encode58: encode58,
        decode58: decode58,

        // Hashing
        hash: hash,
        deriveHash: deriveHash,

        // Signing
        generateWallet: generateWallet,
        addressFromPrivateKey: addressFromPrivateKey,
        signMessage: signMessage,
        signPlainText: signPlainText,

        // HD Crypto
        generateMnemonic: generateMnemonic,
        generateSeedFromMnemonic: generateSeedFromMnemonic,
        generateWalletFromSeed: generateWalletFromSeed,
        generateWalletKeystore: generateWalletKeystore,
        generateSeedFromKeyStore: generateSeedFromKeyStore,
        restoreWalletsFromSeed: restoreWalletsFromSeed
    };
}());
