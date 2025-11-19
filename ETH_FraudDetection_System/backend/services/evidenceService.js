const Evidence = require('../models/Evidence');
const { sha256File, sha256Buffer } = require('../utils/hashFile');
const { getContract, hexToBytes32, stringToBytes32 } = require('../web3/fraudRegistry');
const { ethers } = require('ethers');
const fs = require('fs');

class EvidenceService {
  /**
   * Upload and store evidence
   * @param {Object} params - Upload parameters
   * @param {string} params.txId - Fraud case ID
   * @param {string} params.filePath - Path to uploaded file
   * @param {string} params.fileName - Original file name
   * @param {string} params.walletAddress - Uploader wallet address
   * @param {string} params.uploaderRole - BANK or LEA
   * @param {string} params.evidenceType - pdf, image, csv, log, etc.
   * @returns {Promise<Object>} Evidence record with on-chain tx hash
   */
  async uploadEvidence(params) {
    const { txId, filePath, fileName, walletAddress, uploaderRole, evidenceType } = params;

    try {
      // Compute SHA-256 hash
      const fileHash = await sha256File(filePath);
      
      // Check if evidence already exists in DB
      const existingEvidence = await Evidence.findOne({ txId, fileHash });
      if (existingEvidence) {
        throw new Error('Evidence with this txId and fileHash already exists');
      }

      // Store evidence hash on-chain
      // TODO: Enable contract interaction later
      // For now, skip on-chain storage and return savedToBlockchain: false
      let onChainTxHash = null;
      
      // Contract interaction disabled for now
      // try {
      //   const contract = getContract();
      //   
      //   // Convert txId to bytes32 (if it's not already)
      //   const txIdBytes32 = txId.length === 66 && txId.startsWith('0x') 
      //     ? txId 
      //     : stringToBytes32(txId);
      //   
      //   const fileHashBytes32 = hexToBytes32(fileHash);
      //   
      //   // Call contract
      //   const tx = await contract.storeEvidenceHash(
      //     txIdBytes32,
      //     fileHashBytes32,
      //     evidenceType
      //   );
      //   
      //   onChainTxHash = tx.hash;
      //   console.log(`✅ Evidence stored on-chain: ${onChainTxHash}`);
      // } catch (error) {
      //   console.error('❌ Error storing evidence on-chain:', error.message);
      // }

      // Compute evidenceId = keccak256(abi.encodePacked(txId, fileHash))
      // Same as Solidity: keccak256(abi.encodePacked(txId, fileHash))
      const txIdBytes32 = txId.length === 66 && txId.startsWith('0x') && /^0x[a-fA-F0-9]{64}$/.test(txId)
        ? txId 
        : stringToBytes32(txId);
      const fileHashBytes32 = hexToBytes32(fileHash);
      
      // Use solidityKeccak256 to match Solidity's keccak256(abi.encodePacked(...))
      const evidenceId = ethers.solidityPackedKeccak256(
        ['bytes32', 'bytes32'],
        [txIdBytes32, fileHashBytes32]
      );

      // Save to MongoDB
      const evidence = new Evidence({
        txId,
        fileHash,
        walletAddress,
        uploaderRole,
        fileName,
        evidenceType,
        chainId: 1, // Ethereum mainnet
        onChainTxHash,
        evidenceId
      });

      await evidence.save();

      return {
        success: true,
        evidenceId: evidence._id,
        txId,
        fileHash,
        fileName,
        evidenceType,
        onChainTxHash,
        uploadedAt: evidence.createdAt
      };
    } catch (error) {
      console.error('Error uploading evidence:', error);
      throw error;
    }
  }

  /**
   * Verify evidence authenticity
   * @param {string} filePath - Path to file to verify
   * @param {string} txId - Transaction/case ID
   * @returns {Promise<Object>} Verification result
   */
  async verifyEvidence(filePath, txId) {
    try {
      // Compute hash of provided file
      const computedHash = await sha256File(filePath);
      console.log(`🔍 Verifying evidence:`);
      console.log(`   txId: "${txId}"`);
      console.log(`   Computed hash: ${computedHash}`);

      // Look up in MongoDB - try exact match first
      let evidence = await Evidence.findOne({ txId, fileHash: computedHash });
      
      // If not found, check if case ID exists but hash doesn't match (tampered)
      if (!evidence) {
        const evidenceWithTxId = await Evidence.findOne({ txId });
        if (evidenceWithTxId) {
          console.log(`   ⚠️ Found evidence with txId "${txId}" but hash doesn't match!`);
          console.log(`   Stored hash: ${evidenceWithTxId.fileHash}`);
          console.log(`   Computed hash: ${computedHash}`);
          return {
            status: 'TAMPERED_OR_UNKNOWN',
            fileHash: computedHash,
            txId,
            message: 'File has been tampered with. Hash does not match stored evidence.'
          };
        } else {
          console.log(`   ❌ No evidence found with txId "${txId}"`);
          // Check if txId exists at all (for debugging)
          const allWithTxId = await Evidence.find({ txId });
          console.log(`   Total evidence with this txId: ${allWithTxId.length}`);
          return {
            status: 'TAMPERED_OR_UNKNOWN',
            fileHash: computedHash,
            txId,
            message: `No evidence found with Case ID "${txId}". Make sure you're using the correct Case ID.`
          };
        }
      }

      console.log(`   ✅ Evidence found and verified!`);

      // Optionally verify on-chain
      let onChainVerified = false;
      try {
        const contract = getContract();
        const txIdBytes32 = txId.length === 66 && txId.startsWith('0x') && /^0x[a-fA-F0-9]{64}$/.test(txId)
          ? txId 
          : stringToBytes32(txId);
        const fileHashBytes32 = hexToBytes32(computedHash);
        
        // Use solidityPackedKeccak256 to match Solidity's keccak256(abi.encodePacked(...))
        const evidenceId = ethers.solidityPackedKeccak256(
          ['bytes32', 'bytes32'],
          [txIdBytes32, fileHashBytes32]
        );

        const onChainEvidence = await contract.getEvidence(evidenceId);
        
        if (onChainEvidence && onChainEvidence.fileHash.toLowerCase() === computedHash.toLowerCase()) {
          onChainVerified = true;
        }
      } catch (error) {
        console.warn('Could not verify on-chain:', error.message);
      }

      return {
        status: 'AUTHENTIC',
        fileHash: computedHash,
        txId,
        evidenceId: evidence._id,
        uploaderRole: evidence.uploaderRole,
        evidenceType: evidence.evidenceType,
        uploadedAt: evidence.createdAt,
        onChainVerified,
        onChainTxHash: evidence.onChainTxHash
      };
    } catch (error) {
      console.error('Error verifying evidence:', error);
      throw error;
    }
  }

  /**
   * Get all evidence for a transaction/case
   * @param {string} txId - Transaction/case ID
   * @returns {Promise<Array>} List of evidence records
   */
  async getEvidenceByTxId(txId) {
    return await Evidence.find({ txId }).sort({ createdAt: -1 });
  }

  /**
   * Get all evidence for a wallet
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Array>} List of evidence records
   */
  async getEvidenceByWallet(walletAddress) {
    return await Evidence.find({ walletAddress }).sort({ createdAt: -1 });
  }
}

module.exports = new EvidenceService();

