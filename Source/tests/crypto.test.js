'use strict';

const chainiumCrypto = require('../src/crypto');

////////////////////////////////////////////////////////////////////////////////////////////////////
// Encoding
////////////////////////////////////////////////////////////////////////////////////////////////////

test('utf8ToHex', () => {
    // ARRANGE
    const originalData = 'Chainium';
    const expected = '436861696e69756d';

    // ACT
    const actual = chainiumCrypto.utf8ToHex(originalData);

    // ASSERT
    expect(actual).toBe(expected);
});

test('encode64', () => {
    // ARRANGE
    const originalData = 'Chainium';
    const expected = 'Q2hhaW5pdW0=';

    // ACT
    const actual = chainiumCrypto.encode64(chainiumCrypto.utf8ToHex(originalData));

    // ASSERT
    expect(actual).toBe(expected);
});

test('decode64', () => {
    // ARRANGE
    const encodedData = 'Q2hhaW5pdW0=';
    const expected = '436861696e69756d';

    // ACT
    const actual = chainiumCrypto.decode64(encodedData);

    // ASSERT
    expect(actual).toBe(expected);
});

test('encode58', () => {
    // ARRANGE
    const originalData = 'Chainium';
    const expected = 'CGwVR5Wyya4';

    // ACT
    const actual = chainiumCrypto.encode58(chainiumCrypto.utf8ToHex(originalData));

    // ASSERT
    expect(actual).toBe(expected);
});

test('decode58', () => {
    // ARRANGE
    const encodedData = 'CGwVR5Wyya4';
    const expected = '436861696e69756d';

    // ACT
    const actual = chainiumCrypto.decode58(encodedData);

    // ASSERT
    expect(actual).toBe(expected);
});

test('encode58 and decode58 round trip', () => {
    // ARRANGE
    const expected = '00dffa2420d21220f24d6598bcedadb45328d08358fe8abdd98026705b7f1c5b';
    const expectedLength = 64;

    // ACT
    const actual = chainiumCrypto.decode58(chainiumCrypto.encode58(expected));

    // ASSERT
    expect(actual.length).toBe(expectedLength);
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Hashing
////////////////////////////////////////////////////////////////////////////////////////////////////

test('hash', () => {
    // ARRANGE
    const originalData = 'Chainium';
    const expected = 'Dp6vNLdUbRTc1Y3i9uSBritNqvqe4es9MjjGrVi1nQMu';

    // ACT
    const actual = chainiumCrypto.hash(chainiumCrypto.utf8ToHex(originalData));

    // ASSERT
    expect(actual).toBe(expected);
});

test('deriveHash', () => {
    // ARRANGE
    const address = 'CHPJ6aVwpGBRf1dv6Ey1TuhJzt1VtCP5LYB';
    const nonce = 32;
    const txActionNumber = 2;
    const expected = '5kHcMrwXUptjmbdR8XBW2yY3FkSFwnMdrVr22Yg39pTR';

    // ACT
    const actual = chainiumCrypto.deriveHash(address, nonce, txActionNumber);

    // ASSERT
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Signing
////////////////////////////////////////////////////////////////////////////////////////////////////

test('generateWallet', () => {
    // ARRANGE
    const wallet = chainiumCrypto.generateWallet();
    const expected = wallet.address;

    // ACT
    const actual = chainiumCrypto.addressFromPrivateKey(wallet.privateKey);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addressFromPrivateKey', () => {
    // ARRANGE
    const privateKey = '3rzY3EENhYrWXzUqNnMEbGUr3iEzzSZrjMwJ1CgQpJpq';
    const expected = 'CHGmdQdHfLPcMHtzyDzxAkTAQiRvKJrkYv8';

    // ACT
    const actual = chainiumCrypto.addressFromPrivateKey(privateKey);

    // ASSERT
    expect(actual).toBe(expected);
});

test('signMessage', () => {
    // ARRANGE
    const networkCode = 'UNIT_TESTS';
    const privateKey = '3rzY3EENhYrWXzUqNnMEbGUr3iEzzSZrjMwJ1CgQpJpq';
    const tx = chainiumCrypto.utf8ToHex('Chainium');
    const expected = "EYzWMyZjqHkwsNFKcFEg4Q64m4jSUD7cAeKucyZ3a9MKeNmXTbRK3czqNVGj9RpkPGji9AtGiUxDtipqE3DtFPHxU";

    // ACT
    const actual = chainiumCrypto.signMessage(networkCode, privateKey, tx);

    // ASSERT
    expect(actual).toBe(expected);
});
