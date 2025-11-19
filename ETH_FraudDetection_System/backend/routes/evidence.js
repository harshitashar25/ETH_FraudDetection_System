const express = require('express');
const router = express.Router();
const fs = require('fs');
const evidenceService = require('../services/evidenceService');
const { uploadEvidence, handleMulterError } = require('../middleware/uploadEvidence');

// Log route initialization
console.log('✅ Evidence routes loaded: /api/evidence/upload, /api/evidence/verify, /api/evidence/tx/:txId, /api/evidence/wallet/:walletAddress');

/**
 * Validate Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
function isValidEthAddress(address) {
  if (!address || typeof address !== 'string') {
    return false;
  }
  // Trim whitespace before validation
  const trimmedAddress = address.trim();
  // Check if it's a valid Ethereum address format
  return /^0x[a-fA-F0-9]{40}$/.test(trimmedAddress);
}

/**
 * Validate evidence type
 * @param {string} type - Evidence type to validate
 * @returns {boolean} True if valid
 */
function isValidEvidenceType(type) {
  const validTypes = ['pdf', 'image', 'csv', 'log'];
  return validTypes.includes(type);
}

/**
 * GET /api/evidence/upload
 * Status endpoint for testing
 */
router.get('/upload', (req, res) => {
  console.log('📥 GET /api/evidence/upload - Status check');
  res.json({
    status: 'OK',
    message: 'Use POST with form-data and a file to upload evidence.'
  });
});

/**
 * POST /api/evidence/upload
 * Upload evidence file and store hash
 * 
 * Required form-data fields:
 * - file: File to upload
 * - txId: Transaction/Case ID
 * - walletAddress: Ethereum wallet address
 * - uploaderRole: BANK or LEA
 * - evidenceType: pdf, image, csv, or log
 */
router.post('/upload', uploadEvidence.single('file'), handleMulterError, async (req, res) => {
  console.log('📤 POST /api/evidence/upload - Request received');
  console.log('   File:', req.file ? req.file.originalname : 'No file');
  console.log('   Body fields:', {
    txId: req.body?.txId,
    walletAddress: req.body?.walletAddress,
    uploaderRole: req.body?.uploaderRole,
    evidenceType: req.body?.evidenceType
  });

  try {
    // Validate file was uploaded
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({
        status: 'ERROR',
        message: 'File missing.'
      });
    }

    // Extract form fields
    const { txId, walletAddress, uploaderRole, evidenceType } = req.body;

    // Validate all required fields are present
    const missingFields = [];
    if (!txId || txId.trim() === '') missingFields.push('txId');
    if (!walletAddress || walletAddress.trim() === '') missingFields.push('walletAddress');
    if (!uploaderRole || uploaderRole.trim() === '') missingFields.push('uploaderRole');
    if (!evidenceType || evidenceType.trim() === '') missingFields.push('evidenceType');

    if (missingFields.length > 0) {
      // Clean up uploaded file
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      const fieldNames = {
        'txId': 'txId',
        'walletAddress': 'walletAddress',
        'uploaderRole': 'uploaderRole',
        'evidenceType': 'evidenceType'
      };
      const firstMissing = missingFields[0];
      return res.status(400).json({
        status: 'ERROR',
        message: `Missing ${fieldNames[firstMissing] || firstMissing}.`
      });
    }

    // Trim all input values for validation and processing
    const trimmedTxId = txId.trim();
    const trimmedWalletAddress = walletAddress.trim();
    const trimmedUploaderRole = uploaderRole.trim();
    const trimmedEvidenceType = evidenceType.trim();

    // Validate Ethereum address format (using trimmed address)
    if (!isValidEthAddress(trimmedWalletAddress)) {
      const hexPart = trimmedWalletAddress.startsWith('0x') ? trimmedWalletAddress.substring(2) : trimmedWalletAddress;
      const hexLength = hexPart.length;
      console.log('❌ Invalid wallet address:', trimmedWalletAddress, '(length:', trimmedWalletAddress.length + ', hex part:', hexLength + ')');
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      let errorMessage = 'Invalid walletAddress.';
      if (hexLength !== 40) {
        errorMessage = `Invalid wallet address format. Must be exactly 40 hex characters after 0x (you provided ${hexLength} characters).`;
      }
      return res.status(400).json({
        status: 'ERROR',
        message: errorMessage
      });
    }

    // Validate uploaderRole
    if (!['BANK', 'LEA'].includes(trimmedUploaderRole)) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid uploaderRole.'
      });
    }

    // Validate evidenceType
    if (!isValidEvidenceType(trimmedEvidenceType)) {
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: 'ERROR',
        message: 'Unsupported file type.'
      });
    }

    // Upload evidence using service (using trimmed values)
    const result = await evidenceService.uploadEvidence({
      txId: trimmedTxId,
      filePath: req.file.path,
      fileName: req.file.originalname,
      walletAddress: trimmedWalletAddress,
      uploaderRole: trimmedUploaderRole,
      evidenceType: trimmedEvidenceType
    });

    // Return success response in the requested format
    console.log('✅ Evidence uploaded successfully:', {
      txId: result.txId,
      fileHash: result.fileHash.substring(0, 20) + '...',
      uploaderRole: trimmedUploaderRole
    });

    res.json({
      status: 'SUCCESS',
      message: 'Evidence hashed and stored.',
      txId: result.txId,
      fileHash: result.fileHash,
      uploaderRole: trimmedUploaderRole
    });

  } catch (error) {
    // Clean up file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('❌ Error in /api/evidence/upload:', error);
    
    // Handle specific error cases
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        status: 'ERROR',
        message: 'Duplicate evidence.'
      });
    }

    // Return error response
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to upload evidence.'
    });
  }
});

/**
 * POST /api/evidence/verify
 * Verify evidence file authenticity
 */
router.post('/verify', uploadEvidence.single('file'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'No file uploaded. Please include a file in the request.'
      });
    }

    const { txId } = req.body;

    if (!txId || txId.trim() === '') {
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        status: 'ERROR',
        message: 'Missing required field: txId'
      });
    }

    // Verify evidence
    const result = await evidenceService.verifyEvidence(req.file.path, txId.trim());

    // Clean up uploaded file
    if (req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json(result);
  } catch (error) {
    // Clean up file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error in /api/evidence/verify:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to verify evidence'
    });
  }
});

/**
 * GET /api/evidence/tx/:txId
 * Get all evidence for a transaction/case
 */
router.get('/tx/:txId', async (req, res) => {
  try {
    const { txId } = req.params;
    const evidence = await evidenceService.getEvidenceByTxId(txId);
    
    res.json({
      status: 'OK',
      txId,
      count: evidence.length,
      evidence
    });
  } catch (error) {
    console.error('Error in /api/evidence/tx/:txId:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to fetch evidence'
    });
  }
});

/**
 * GET /api/evidence/wallet/:walletAddress
 * Get all evidence for a wallet
 */
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    // Trim address from URL parameter
    const trimmedWalletAddress = walletAddress.trim();
    
    // Validate address format
    if (!isValidEthAddress(trimmedWalletAddress)) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Invalid Ethereum wallet address format'
      });
    }

    const evidence = await evidenceService.getEvidenceByWallet(trimmedWalletAddress);
    
    res.json({
      status: 'OK',
      walletAddress: trimmedWalletAddress,
      count: evidence.length,
      evidence
    });
  } catch (error) {
    console.error('Error in /api/evidence/wallet/:walletAddress:', error);
    res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Failed to fetch evidence'
    });
  }
});

/**
 * GET /api/evidence/test
 * Test endpoint to verify route is working
 */
router.get('/test', (req, res) => {
  res.json({ 
    status: 'OK',
    message: 'Evidence route is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
