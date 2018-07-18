(function () {
    'use strict';

    var CryptoJS = require('crypto-js');
    var Base58 = require('bs58');
    var EC = require('elliptic').ec;

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
        return CryptoJS.enc.Hex.stringify(
            CryptoJS.SHA256(
                CryptoJS.enc.Hex.parse(hexData)
            )
        );
    }

    function sha512(hexData) {
        return CryptoJS.enc.Hex.stringify(
            CryptoJS.SHA512(
                CryptoJS.enc.Hex.parse(hexData)
            )
        );
    }

    function sha160(hexData) {
        return sha512(hexData).substr(0, 40); // First 20 bytes.
    }

    function hash(hexData) {
        return encode58(sha256(hexData));
    }

    function chainiumAddress(hexPublicKey) {
        var prefix = '065A';
        var hash = sha160(sha256(hexPublicKey));
        var checksum = sha256(sha256(hash)).substr(0, 8); // First 4 bytes.
        return encode58(prefix + hash + checksum);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Signing
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    var ec = new EC('secp256k1');

    function generateWallet() {
        var keyPair = ec.genKeyPair();
        return {
            privateKey: encode58(keyPair.getPrivate('hex')),
            address: chainiumAddress(keyPair.getPublic('hex'))
        };
    }

    function addressFromPrivateKey(privateKey) {
        var keyPair = ec.keyFromPrivate(decode58(privateKey), 'hex');
        return chainiumAddress(keyPair.getPublic('hex'));
    }

    function signMessage(privateKey, hexMessage) {
        var messageHash = sha256(hexMessage);
        var signature = ec.sign(messageHash, decode58(privateKey), 'hex', {canonical: false});
        return {
            v: encode58('0' + signature.recoveryParam),
            r: encode58(signature.r.toString('hex').padStart(64, "0")),
            s: encode58(signature.s.toString('hex').padStart(64, "0"))
        };
    }

    module.exports = {
        // Encoding
        utf8ToHex: utf8ToHex,
        encode64: encode64,
        decode64: decode64,
        encode58: encode58,
        decode58: decode58,

        // Hashing
        hash: hash,

        // Signing
        generateWallet: generateWallet,
        addressFromPrivateKey: addressFromPrivateKey,
        signMessage: signMessage
    };
}());
