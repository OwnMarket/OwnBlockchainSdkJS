'use strict';

const ownCrypto = require('../src/crypto');

////////////////////////////////////////////////////////////////////////////////////////////////////
// Encoding
////////////////////////////////////////////////////////////////////////////////////////////////////

test('utf8ToHex', () => {
    // ARRANGE
    const originalData = 'Chainium';
    const expected = '436861696e69756d';

    // ACT
    const actual = ownCrypto.utf8ToHex(originalData);

    // ASSERT
    expect(actual).toBe(expected);
});

test('encode64', () => {
    // ARRANGE
    const originalData = 'Chainium';
    const expected = 'Q2hhaW5pdW0=';

    // ACT
    const actual = ownCrypto.encode64(ownCrypto.utf8ToHex(originalData));

    // ASSERT
    expect(actual).toBe(expected);
});

test('decode64', () => {
    // ARRANGE
    const encodedData = 'Q2hhaW5pdW0=';
    const expected = ownCrypto.utf8ToHex('Chainium');

    // ACT
    const actual = ownCrypto.decode64(encodedData);

    // ASSERT
    expect(actual).toBe(expected);
});

test('encode58', () => {
    // ARRANGE
    const originalData = 'Chainium';
    const expected = 'CGwVR5Wyya4';

    // ACT
    const actual = ownCrypto.encode58(ownCrypto.utf8ToHex(originalData));

    // ASSERT
    expect(actual).toBe(expected);
});

test('decode58', () => {
    // ARRANGE
    const encodedData = 'CGwVR5Wyya4';
    const expected = ownCrypto.utf8ToHex('Chainium');

    // ACT
    const actual = ownCrypto.decode58(encodedData);

    // ASSERT
    expect(actual).toBe(expected);
});

test('encode58 and decode58 round trip', () => {
    // ARRANGE
    const expected = '00dffa2420d21220f24d6598bcedadb45328d08358fe8abdd98026705b7f1c5b';
    const expectedLength = 64;

    // ACT
    const actual = ownCrypto.decode58(ownCrypto.encode58(expected));

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
    const actual = ownCrypto.hash(ownCrypto.utf8ToHex(originalData));

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
    const actual = ownCrypto.deriveHash(address, nonce, txActionNumber);

    // ASSERT
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Signing
////////////////////////////////////////////////////////////////////////////////////////////////////

test('generateWallet', () => {
    // ARRANGE
    const wallet = ownCrypto.generateWallet();
    const expected = wallet.address;

    // ACT
    const actual = ownCrypto.addressFromPrivateKey(wallet.privateKey);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addressFromPrivateKey', () => {
    // ARRANGE
    const privateKey = '3rzY3EENhYrWXzUqNnMEbGUr3iEzzSZrjMwJ1CgQpJpq';
    const expected = 'CHGmdQdHfLPcMHtzyDzxAkTAQiRvKJrkYv8';

    // ACT
    const actual = ownCrypto.addressFromPrivateKey(privateKey);

    // ASSERT
    expect(actual).toBe(expected);
});

test('signMessage', () => {
    // ARRANGE
    const networkCode = 'UNIT_TESTS';
    const privateKey = '3rzY3EENhYrWXzUqNnMEbGUr3iEzzSZrjMwJ1CgQpJpq';
    const tx = ownCrypto.utf8ToHex('Chainium');
    const expected = "EYzWMyZjqHkwsNFKcFEg4Q64m4jSUD7cAeKucyZ3a9MKeNmXTbRK3czqNVGj9RpkPGji9AtGiUxDtipqE3DtFPHxU";

    // ACT
    const actual = ownCrypto.signMessage(networkCode, privateKey, tx);

    // ASSERT
    expect(actual).toBe(expected);
});

test('signPlainText', () => {
    // ARRANGE
    const privateKey = '3rzY3EENhYrWXzUqNnMEbGUr3iEzzSZrjMwJ1CgQpJpq';
    const txt = 'Chainium';
    const expected = "EzCsWgPozyVT9o6TycYV6q1n4YK4QWixa6Lk4GFvwrj6RU3K1wHcwNPZJUMBYcsGp5oFhytHiThon5zqE8uLk8naB";

    // ACT
    const actual = ownCrypto.signPlainText(privateKey, txt);

    // ASSERT
    expect(actual).toBe(expected);
});

test('verifyPlainTextSignature', () => {
    // ARRANGE
    const wallet = ownCrypto.generateWallet();
    const privateKey = wallet.privateKey;
    const expected = ownCrypto.addressFromPrivateKey(privateKey);
    const txt = 'Chainium';
    const signature = ownCrypto.signPlainText(privateKey, txt);

    // ACT
    const actual = ownCrypto.verifyPlainTextSignature(signature, txt);

    // ASSERT
    expect(actual).toBe(expected);
});

test('generateWalletFromMnemonic', () => {
    // ARRANGE
    const mnemonic = "receive raccoon rocket donkey cherry garbage medal skirt random smoke young before scale leave hold insect foster blouse mail donkey regular vital hurt april";

    // ACT
    const seed = ownCrypto.generateSeedFromMnemonic(mnemonic);
    const wallet = ownCrypto.generateWalletFromSeed(seed, 0);

    // ASSERT
    expect(wallet.privateKey).toBe("ECPVXjz78oMdmLKbHVAAo7X7evtTh4EfnaW5Yc1SHWaj");
    expect(wallet.address).toBe("CHb5Z6Za34nv28Z3rLZ2Yd8LFikHaTqLhxB");
});
