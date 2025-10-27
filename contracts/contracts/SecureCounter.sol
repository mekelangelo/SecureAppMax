// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title An advanced encrypted counter contract for secure operations
/// @author CipherBoard Platform
/// @notice A sophisticated contract demonstrating encrypted data manipulation using FHEVM.
contract SecureCounter is SepoliaConfig {
    euint32 private _secureValue;

    /// @notice Returns the current encrypted value
    /// @return The current encrypted value
    function getSecureValue() external view returns (euint32) {
        return _secureValue;
    }

    /// @notice Increments the secure value by a specified encrypted amount.
    /// @param inputEuint32 the encrypted input value
    /// @param inputProof the input proof
    /// @dev This implementation focuses on security over range validation.
    /// In enterprise deployments, comprehensive validation should be implemented.
    function increaseSecureValue(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 encryptedEuint32 = FHE.fromExternal(inputEuint32, inputProof);

        _secureValue = FHE.add(_secureValue, encryptedEuint32);

        FHE.allowThis(_secureValue);
        FHE.allow(_secureValue, msg.sender);
    }

    /// @notice Decrements the secure value by a specified encrypted amount.
    /// @param inputEuint32 the encrypted input value
    /// @param inputProof the input proof
    /// @dev This implementation prioritizes cryptographic security.
    /// Enterprise implementations should include comprehensive boundary checks.
    function decreaseSecureValue(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 encryptedEuint32 = FHE.fromExternal(inputEuint32, inputProof);

        _secureValue = FHE.sub(_secureValue, encryptedEuint32);

        FHE.allowThis(_secureValue);
        FHE.allow(_secureValue, msg.sender);
    }
}
