// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FraudRegistry
 * @dev Extended fraud detection contract with evidence hashing and wallet flagging
 */
contract FraudRegistry is Ownable {
    
    // ============ EVIDENCE HASHING ============
    
    struct Evidence {
        bytes32 fileHash;         // SHA-256 hash of the file
        address uploader;         // Who uploaded (bank / LEA wallet)
        uint256 uploadedAt;       // Block timestamp
        string evidenceType;      // e.g. "pdf", "image", "log"
    }
    
    // Mapping: evidenceId (keccak256(txId, fileHash)) => Evidence
    mapping(bytes32 => Evidence) public evidenceById;
    
    event EvidenceStored(
        bytes32 indexed txId,
        bytes32 indexed fileHash,
        address indexed uploader,
        string evidenceType
    );
    
    /**
     * @notice Store evidence hash on-chain
     * @param txId Off-chain fraud case ID or on-chain tx hash compressed
     * @param fileHash SHA-256 hash of the file (bytes32)
     * @param evidenceType Type of evidence (pdf, image, csv, log, etc.)
     */
    function storeEvidenceHash(
        bytes32 txId,
        bytes32 fileHash,
        string calldata evidenceType
    ) external {
        // Compute evidenceId = keccak256(abi.encodePacked(txId, fileHash))
        bytes32 evidenceId = keccak256(abi.encodePacked(txId, fileHash));
        
        // Require that we don't overwrite existing evidence
        require(
            evidenceById[evidenceId].uploadedAt == 0,
            "Evidence already exists"
        );
        
        // Save Evidence struct
        evidenceById[evidenceId] = Evidence({
            fileHash: fileHash,
            uploader: msg.sender,
            uploadedAt: block.timestamp,
            evidenceType: evidenceType
        });
        
        // Emit event
        emit EvidenceStored(txId, fileHash, msg.sender, evidenceType);
    }
    
    /**
     * @notice Get evidence details by evidenceId
     * @param evidenceId keccak256(abi.encodePacked(txId, fileHash))
     * @return Evidence struct
     */
    function getEvidence(bytes32 evidenceId) external view returns (Evidence memory) {
        return evidenceById[evidenceId];
    }
    
    // ============ WALLET FLAGGING ============
    
    struct WalletFlag {
        bool isFlagged;
        uint256 flaggedAt;
        string reason;
        address flaggedBy;
    }
    
    // Mapping: wallet address => WalletFlag
    mapping(address => WalletFlag) public walletFlags;
    
    // Mapping: authorized reporter addresses
    mapping(address => bool) public authorizedReporters;
    
    event WalletFlagged(
        address indexed wallet,
        string reason,
        address indexed flaggedBy
    );
    
    event WalletUnflagged(
        address indexed wallet,
        address indexed unflaggedBy
    );
    
    /**
     * @notice Add or remove authorized reporter
     */
    function setAuthorizedReporter(address reporter, bool authorized) external onlyOwner {
        authorizedReporters[reporter] = authorized;
    }
    
    /**
     * @notice Flag a wallet (when fraud is detected)
     * @param wallet Wallet address to flag
     * @param reason Reason for flagging
     */
    function flagWallet(address wallet, string calldata reason) external {
        require(
            msg.sender == owner() || authorizedReporters[msg.sender],
            "Not authorized to flag wallets"
        );
        require(wallet != address(0), "Invalid wallet address");
        
        walletFlags[wallet] = WalletFlag({
            isFlagged: true,
            flaggedAt: block.timestamp,
            reason: reason,
            flaggedBy: msg.sender
        });
        
        emit WalletFlagged(wallet, reason, msg.sender);
    }
    
    /**
     * @notice Unflag a wallet
     * @param wallet Wallet address to unflag
     */
    function unflagWallet(address wallet) external {
        require(
            msg.sender == owner() || authorizedReporters[msg.sender],
            "Not authorized to unflag wallets"
        );
        require(walletFlags[wallet].isFlagged, "Wallet is not flagged");
        
        walletFlags[wallet].isFlagged = false;
        
        emit WalletUnflagged(wallet, msg.sender);
    }
    
    /**
     * @notice Check if a wallet is flagged
     * @param wallet Wallet address to check
     * @return bool Whether the wallet is flagged
     */
    function isWalletFlagged(address wallet) external view returns (bool) {
        return walletFlags[wallet].isFlagged;
    }
    
    /**
     * @notice Get wallet flag details
     * @param wallet Wallet address
     * @return WalletFlag struct
     */
    function getWalletFlag(address wallet) external view returns (WalletFlag memory) {
        return walletFlags[wallet];
    }
    
    // ============ FRAUD REPORTING (extended from existing) ============
    
    event FraudReported(
        address indexed wallet,
        bytes32 indexed txId,
        uint256 riskScore,
        uint256 timestamp
    );
    
    /**
     * @notice Report fraud and optionally flag wallet
     * @param wallet Wallet address involved in fraud
     * @param txId Transaction or case ID
     * @param riskScore Risk score (0-100)
     * @param shouldFlag Whether to flag the wallet
     * @param flagReason Reason for flagging (if shouldFlag is true)
     */
    function reportFraudWithWallet(
        address wallet,
        bytes32 txId,
        uint256 riskScore,
        bool shouldFlag,
        string calldata flagReason
    ) external {
        require(
            msg.sender == owner() || authorizedReporters[msg.sender],
            "Not authorized to report fraud"
        );
        
        emit FraudReported(wallet, txId, riskScore, block.timestamp);
        
        // Optionally flag wallet
        if (shouldFlag && wallet != address(0)) {
            walletFlags[wallet] = WalletFlag({
                isFlagged: true,
                flaggedAt: block.timestamp,
                reason: flagReason,
                flaggedBy: msg.sender
            });
            
            emit WalletFlagged(wallet, flagReason, msg.sender);
        }
    }
}

