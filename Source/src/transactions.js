(function () {
    'use strict';

    var ownSdkCrypto = require('./crypto.js');

    function createTx(senderAddress, nonce, actionFee, expirationTime) {
        return (function () {
            var tx = {
                senderAddress: senderAddress,
                nonce: nonce,
                expirationTime: expirationTime || 0,
                actionFee: actionFee,
                actions: []
            };

            function addAction(actionType, actionData) {
                tx.actions.push({
                    actionType: actionType,
                    actionData: actionData
                });
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            // Actions
            ////////////////////////////////////////////////////////////////////////////////////////////////////

            function addTransferChxAction(recipientAddress, amount) {
                addAction('TransferChx', {
                    recipientAddress: recipientAddress,
                    amount: amount
                });
            }

            function addDelegateStakeAction(validatorAddress, amount) {
                addAction('DelegateStake', {
                    validatorAddress: validatorAddress,
                    amount: amount
                });
            }

            function addConfigureValidatorAction(networkAddress, sharedRewardPercent, isEnabled) {
                addAction('ConfigureValidator', {
                    networkAddress: networkAddress,
                    sharedRewardPercent: sharedRewardPercent,
                    isEnabled: isEnabled
                });
            }

            function addRemoveValidatorAction() {
                addAction('RemoveValidator', {
                });
            }

            function addTransferAssetAction(fromAccountHash, toAccountHash, assetHash, amount) {
                addAction('TransferAsset', {
                    fromAccountHash: fromAccountHash,
                    toAccountHash: toAccountHash,
                    assetHash: assetHash,
                    amount: amount
                });
            }

            function addCreateAssetEmissionAction(emissionAccountHash, assetHash, amount) {
                addAction('CreateAssetEmission', {
                    emissionAccountHash: emissionAccountHash,
                    assetHash: assetHash,
                    amount: amount
                });
            }

            function addCreateAssetAction() {
                addAction('CreateAsset', {
                });
                return ownSdkCrypto.deriveHash(tx.senderAddress, tx.nonce, tx.actions.length);
            }

            function addSetAssetCodeAction(assetHash, assetCode) {
                addAction('SetAssetCode', {
                    assetHash: assetHash,
                    assetCode: assetCode
                });
            }

            function addSetAssetControllerAction(assetHash, controllerAddress) {
                addAction('SetAssetController', {
                    assetHash: assetHash,
                    controllerAddress: controllerAddress
                });
            }

            function addCreateAccountAction() {
                addAction('CreateAccount', {
                });
                return ownSdkCrypto.deriveHash(tx.senderAddress, tx.nonce, tx.actions.length);
            }

            function addSetAccountControllerAction(accountHash, controllerAddress) {
                addAction('SetAccountController', {
                    accountHash: accountHash,
                    controllerAddress: controllerAddress
                });
            }

            function addSubmitVoteAction(accountHash, assetHash, resolutionHash, voteHash) {
                addAction('SubmitVote', {
                    accountHash: accountHash,
                    assetHash: assetHash,
                    resolutionHash: resolutionHash,
                    voteHash: voteHash
                });
            }

            function addSubmitVoteWeightAction(accountHash, assetHash, resolutionHash, voteWeight) {
                addAction('SubmitVoteWeight', {
                    accountHash: accountHash,
                    assetHash: assetHash,
                    resolutionHash: resolutionHash,
                    voteWeight: voteWeight
                });
            }

            function addSetAccountEligibilityAction(accountHash, assetHash, isPrimaryEligible, isSecondaryEligible) {
                addAction('SetAccountEligibility', {
                    accountHash: accountHash,
                    assetHash: assetHash,
                    isPrimaryEligible: isPrimaryEligible,
                    isSecondaryEligible: isSecondaryEligible
                });
            }

            function addSetAssetEligibilityAction(assetHash, isEligibilityRequired) {
                addAction('SetAssetEligibility', {
                    assetHash: assetHash,
                    isEligibilityRequired: isEligibilityRequired
                });
            }

            function addChangeKycControllerAddressAction(accountHash, assetHash, kycControllerAddress) {
                addAction('ChangeKycControllerAddress', {
                    accountHash: accountHash,
                    assetHash: assetHash,
                    kycControllerAddress: kycControllerAddress
                });
            }

            function addAddKycProviderAction(assetHash, providerAddress) {
                addAction('AddKycProvider', {
                    assetHash: assetHash,
                    providerAddress: providerAddress
                });
            }

            function addRemoveKycProviderAction(assetHash, providerAddress) {
                addAction('RemoveKycProvider', {
                    assetHash: assetHash,
                    providerAddress: providerAddress
                });
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            // Signing
            ////////////////////////////////////////////////////////////////////////////////////////////////////

            function toJson(indentation) {
                if (indentation > 0) {
                    return JSON.stringify(tx, null, indentation);
                } else {
                    return JSON.stringify(tx);
                }
            }

            function sign(networkCode, privateKey) {
                var json = JSON.stringify(tx);
                var rawTx = ownSdkCrypto.utf8ToHex(json)
                var signature = ownSdkCrypto.signMessage(networkCode, privateKey, rawTx);
                return {
                    tx: ownSdkCrypto.encode64(rawTx),
                    signature: signature
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////////////////////
            // Public Interface
            ////////////////////////////////////////////////////////////////////////////////////////////////////

            return {
                addTransferChxAction: addTransferChxAction,
                addDelegateStakeAction: addDelegateStakeAction,
                addConfigureValidatorAction: addConfigureValidatorAction,
                addRemoveValidatorAction: addRemoveValidatorAction,
                addTransferAssetAction: addTransferAssetAction,
                addCreateAssetEmissionAction: addCreateAssetEmissionAction,
                addCreateAssetAction: addCreateAssetAction,
                addSetAssetCodeAction: addSetAssetCodeAction,
                addSetAssetControllerAction: addSetAssetControllerAction,
                addCreateAccountAction: addCreateAccountAction,
                addSetAccountControllerAction: addSetAccountControllerAction,
                addSubmitVoteAction: addSubmitVoteAction,
                addSubmitVoteWeightAction: addSubmitVoteWeightAction,
                addSetAccountEligibilityAction: addSetAccountEligibilityAction,
                addSetAssetEligibilityAction: addSetAssetEligibilityAction,
                addChangeKycControllerAddressAction: addChangeKycControllerAddressAction,
                addAddKycProviderAction: addAddKycProviderAction,
                addRemoveKycProviderAction: addRemoveKycProviderAction,

                toJson: toJson,
                sign: sign
            }
        }());
    }

    module.exports = {
        createTx: createTx
    };
}());
