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
    const expected = 'CHGmdQdHfLPcMHtzyDzxAkTAQiRvKHFoMPm';

    // ACT
    const actual = chainiumCrypto.addressFromPrivateKey(privateKey);

    // ASSERT
    expect(actual).toBe(expected);
});

test('signMessage', () => {
    // ARRANGE
    const privateKey = '3rzY3EENhYrWXzUqNnMEbGUr3iEzzSZrjMwJ1CgQpJpq';
    const tx = chainiumCrypto.utf8ToHex('Chainium');
    const expected = {
        v: "1",
        r: "BfgsYFCqzKt9ViJpXT2Jt5yM323EdFCyygYSzPoeasNb",
        s: "84Vups9Q2ubF7jg9Xa6b9vMQWgLAsMnyp1VFnAk6yHVb"
    };

    // ACT
    const actual = chainiumCrypto.signMessage(privateKey, tx);

    // ASSERT
    expect(actual.v).toBe(expected.v);
    expect(actual.r).toBe(expected.r);
    expect(actual.s).toBe(expected.s);
});
