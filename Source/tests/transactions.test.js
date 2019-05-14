'use strict';

const ownCrypto = require('../src/crypto');
const ownTxs = require('../src/transactions');

////////////////////////////////////////////////////////////////////////////////////////////////////
// TX
////////////////////////////////////////////////////////////////////////////////////////////////////

test('createTx results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 123,
    "actionFee": 0.01,
    "actions": []
}`;

    // ACT
    const actual = ownTxs.createTx(senderWallet.address, 1, 0.01, 123).toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('createTx sets expirationTime to zero if not provided', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": []
}`;

    // ACT
    const actual = ownTxs.createTx(senderWallet.address, 1, 0.01, 0).toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Actions: Network Management
////////////////////////////////////////////////////////////////////////////////////////////////////

test('addTransferChxAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const recipientWallet = ownCrypto.generateWallet();
    const amount = 1000
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "TransferChx",
            "actionData": {
                "recipientAddress": "${recipientWallet.address}",
                "amount": ${amount}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addTransferChxAction(recipientWallet.address, amount);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addDelegateStakeAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const validatorWallet = ownCrypto.generateWallet();
    const amount = 100000
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "DelegateStake",
            "actionData": {
                "validatorAddress": "${validatorWallet.address}",
                "amount": ${amount}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addDelegateStakeAction(validatorWallet.address, amount);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addConfigureValidatorAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const networkAddress = "val01.some.domain.com:25718"
    const sharedRewardPercent = 42
    const isEnabled = true
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "ConfigureValidator",
            "actionData": {
                "networkAddress": "${networkAddress}",
                "sharedRewardPercent": ${sharedRewardPercent},
                "isEnabled": ${isEnabled}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addConfigureValidatorAction(networkAddress, sharedRewardPercent, isEnabled);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addRemoveValidatorAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "RemoveValidator",
            "actionData": {}
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addRemoveValidatorAction();
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Actions: Asset Management
////////////////////////////////////////////////////////////////////////////////////////////////////

test('addTransferAssetAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const fromAccountHash = 'FAccH1'
    const toAccountHash = 'TAccH1'
    const assetHash = 'AssetH1'
    const amount = 100
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "TransferAsset",
            "actionData": {
                "fromAccountHash": "${fromAccountHash}",
                "toAccountHash": "${toAccountHash}",
                "assetHash": "${assetHash}",
                "amount": ${amount}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addTransferAssetAction(fromAccountHash, toAccountHash, assetHash, amount);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addCreateAssetEmissionAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const emissionAccountHash = 'EAccH1'
    const assetHash = 'AssetH1'
    const amount = 10000
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "CreateAssetEmission",
            "actionData": {
                "emissionAccountHash": "${emissionAccountHash}",
                "assetHash": "${assetHash}",
                "amount": ${amount}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addCreateAssetEmissionAction(emissionAccountHash, assetHash, amount);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addCreateAssetAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "CreateAsset",
            "actionData": {}
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addCreateAssetAction();
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addSetAssetCodeAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const assetHash = 'AssetH1'
    const assetCode = 'AST1'
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "SetAssetCode",
            "actionData": {
                "assetHash": "${assetHash}",
                "assetCode": "${assetCode}"
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addSetAssetCodeAction(assetHash, assetCode);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addSetAssetControllerAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const assetHash = 'AssetH1'
    const controllerWallet = ownCrypto.generateWallet();
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "SetAssetController",
            "actionData": {
                "assetHash": "${assetHash}",
                "controllerAddress": "${controllerWallet.address}"
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addSetAssetControllerAction(assetHash, controllerWallet.address);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addCreateAccountAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "CreateAccount",
            "actionData": {}
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addCreateAccountAction();
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addSetAccountControllerAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const accountHash = 'AccountH1'
    const controllerWallet = ownCrypto.generateWallet();
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "SetAccountController",
            "actionData": {
                "accountHash": "${accountHash}",
                "controllerAddress": "${controllerWallet.address}"
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addSetAccountControllerAction(accountHash, controllerWallet.address);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Actions: Voting
////////////////////////////////////////////////////////////////////////////////////////////////////

test('addSubmitVoteAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const accountHash = 'FAccH1'
    const assetHash = 'AssetH1'
    const resolutionHash = 'ResolutionH1'
    const voteHash = 'VoteH1'
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "SubmitVote",
            "actionData": {
                "accountHash": "${accountHash}",
                "assetHash": "${assetHash}",
                "resolutionHash": "${resolutionHash}",
                "voteHash": "${voteHash}"
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addSubmitVoteAction(accountHash, assetHash, resolutionHash, voteHash);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addSubmitVoteWeightAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const accountHash = 'FAccH1'
    const assetHash = 'AssetH1'
    const resolutionHash = 'ResolutionH1'
    const voteWeight = 12345
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "SubmitVoteWeight",
            "actionData": {
                "accountHash": "${accountHash}",
                "assetHash": "${assetHash}",
                "resolutionHash": "${resolutionHash}",
                "voteWeight": ${voteWeight}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addSubmitVoteWeightAction(accountHash, assetHash, resolutionHash, voteWeight);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Actions: Eligibility
////////////////////////////////////////////////////////////////////////////////////////////////////

test('addSetAccountEligibilityAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const accountHash = 'FAccH1'
    const assetHash = 'AssetH1'
    const isPrimaryEligible = false
    const isSecondaryEligible = true
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "SetAccountEligibility",
            "actionData": {
                "accountHash": "${accountHash}",
                "assetHash": "${assetHash}",
                "isPrimaryEligible": ${isPrimaryEligible},
                "isSecondaryEligible": ${isSecondaryEligible}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addSetAccountEligibilityAction(accountHash, assetHash, isPrimaryEligible, isSecondaryEligible);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addSetAssetEligibilityAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const assetHash = 'AssetH1'
    const isEligibilityRequired = true
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "SetAssetEligibility",
            "actionData": {
                "assetHash": "${assetHash}",
                "isEligibilityRequired": ${isEligibilityRequired}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addSetAssetEligibilityAction(assetHash, isEligibilityRequired);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addChangeKycControllerAddressAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const accountHash = 'FAccH1'
    const assetHash = 'AssetH1'
    const kycControllerAddress = 'KycCtrlAddr1'
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "ChangeKycControllerAddress",
            "actionData": {
                "accountHash": "${accountHash}",
                "assetHash": "${assetHash}",
                "kycControllerAddress": "${kycControllerAddress}"
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addChangeKycControllerAddressAction(accountHash, assetHash, kycControllerAddress);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addAddKycProviderAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const assetHash = 'AssetH1'
    const providerAddress = ownCrypto.generateWallet().address;
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "AddKycProvider",
            "actionData": {
                "assetHash": "${assetHash}",
                "providerAddress": "${providerAddress}"
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addAddKycProviderAction(assetHash, providerAddress);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

test('addRemoveKycProviderAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const assetHash = 'AssetH1'
    const providerAddress = ownCrypto.generateWallet().address;
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "RemoveKycProvider",
            "actionData": {
                "assetHash": "${assetHash}",
                "providerAddress": "${providerAddress}"
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addRemoveKycProviderAction(assetHash, providerAddress);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Actions: Multiple
////////////////////////////////////////////////////////////////////////////////////////////////////

test('addTransferChxAction results in correct JSON structure', () => {
    // ARRANGE
    const senderWallet = ownCrypto.generateWallet();
    const recipientWallet1 = ownCrypto.generateWallet();
    const recipientWallet2 = ownCrypto.generateWallet();
    const amount1 = 200
    const amount2 = 300
    const expected =
`{
    "senderAddress": "${senderWallet.address}",
    "nonce": 1,
    "expirationTime": 0,
    "actionFee": 0.01,
    "actions": [
        {
            "actionType": "TransferChx",
            "actionData": {
                "recipientAddress": "${recipientWallet1.address}",
                "amount": ${amount1}
            }
        },
        {
            "actionType": "TransferChx",
            "actionData": {
                "recipientAddress": "${recipientWallet2.address}",
                "amount": ${amount2}
            }
        }
    ]
}`;

    // ACT
    const tx = ownTxs.createTx(senderWallet.address, 1, 0.01, 0);
    tx.addTransferChxAction(recipientWallet1.address, amount1);
    tx.addTransferChxAction(recipientWallet2.address, amount2);
    const actual = tx.toJson(4);

    // ASSERT
    expect(actual).toBe(expected);
});
