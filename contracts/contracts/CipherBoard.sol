// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint256, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title An elite blockchain private messaging platform
/// @author CipherBoard DApp
/// @notice Users can send encrypted confidential communications to addresses. Communications are immutable once transmitted.
/// @dev Utilizes FHEVM for content encryption and advanced access control
contract CipherBoard is SepoliaConfig {

    struct SecureMessage {
        address sender;         // Sender address (public)
        address recipient;      // Recipient address (public)
        euint256 encryptedContent; // Encrypted communication content
        uint256 transmissionTime; // When the communication was transmitted
        uint256 messageId;      // Unique communication identifier
    }

    // Array to store all secure communications
    SecureMessage[] private _secureMessages;

    // Counter for communication IDs
    uint256 private _nextMessageId = 1;

    // Events
    event SecureMessageTransmitted(
        address indexed sender,
        address indexed recipient,
        uint256 indexed messageId,
        uint256 transmissionTime
    );

    /// @notice Transmit an encrypted confidential communication to a recipient
    /// @param recipient The recipient's address
    /// @param encryptedContent The encrypted communication content
    /// @param inputProof The input proof for the encrypted content
    function transmitSecureMessage(
        address recipient,
        externalEuint256 encryptedContent,
        bytes calldata inputProof
    ) external {
        require(recipient != address(0), "Cannot transmit to zero address");
        require(recipient != msg.sender, "Cannot transmit communication to yourself");

        // Convert external encrypted input to internal encrypted type
        euint256 content = FHE.fromExternal(encryptedContent, inputProof);

        // Create new secure message
        SecureMessage memory newMessage = SecureMessage({
            sender: msg.sender,
            recipient: recipient,
            encryptedContent: content,
            transmissionTime: block.timestamp,
            messageId: _nextMessageId
        });

        _secureMessages.push(newMessage);

        // Grant decryption access to recipient
        FHE.allow(content, recipient);

        // Allow contract owner to manage this communication (for potential future features)
        FHE.allowThis(content);

        emit SecureMessageTransmitted(msg.sender, recipient, _nextMessageId, block.timestamp);

        _nextMessageId++;
    }

    /// @notice Get the total number of secure communications
    /// @return The total count of communications
    function getTotalCommunications() external view returns (uint256) {
        return _secureMessages.length;
    }

    /// @notice Get basic info about a communication (without encrypted content)
    /// @param messageId The ID of the communication
    /// @return sender Sender address
    /// @return recipient Recipient address
    /// @return transmissionTime When the communication was transmitted
    function getCommunicationInfo(uint256 messageId)
        external
        view
        returns (address sender, address recipient, uint256 transmissionTime)
    {
        require(messageId > 0 && messageId < _nextMessageId, "Invalid communication ID");

        SecureMessage storage message = _secureMessages[messageId - 1];
        return (message.sender, message.recipient, message.transmissionTime);
    }

    /// @notice Get the encrypted content of a communication (only recipient can decrypt)
    /// @param messageId The ID of the communication
    /// @return The encrypted content
    function getCommunicationContent(uint256 messageId) external view returns (euint256) {
        require(messageId > 0 && messageId < _nextMessageId, "Invalid communication ID");

        SecureMessage storage message = _secureMessages[messageId - 1];
        return message.encryptedContent;
    }

    /// @notice Get communications sent to a specific address
    /// @param recipient The recipient address to query
    /// @return messageIds Array of communication IDs sent to this recipient
    function getCommunicationsForRecipient(address recipient)
        external
        view
        returns (uint256[] memory messageIds)
    {
        // First pass: count communications for this recipient
        uint256 count = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].recipient == recipient) {
                count++;
            }
        }

        // Second pass: collect communication IDs
        messageIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].recipient == recipient) {
                messageIds[index] = _secureMessages[i].messageId;
                index++;
            }
        }

        return messageIds;
    }

    /// @notice Get communications sent by a specific address
    /// @param sender The sender address to query
    /// @return messageIds Array of communication IDs sent by this address
    function getCommunicationsBySender(address sender)
        external
        view
        returns (uint256[] memory messageIds)
    {
        // First pass: count communications from this sender
        uint256 count = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].sender == sender) {
                count++;
            }
        }

        // Second pass: collect communication IDs
        messageIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < _secureMessages.length; i++) {
            if (_secureMessages[i].sender == sender) {
                messageIds[index] = _secureMessages[i].messageId;
                index++;
            }
        }

        return messageIds;
    }
}
