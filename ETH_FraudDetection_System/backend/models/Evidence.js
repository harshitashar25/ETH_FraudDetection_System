const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  txId: { 
    type: String, 
    required: true,
    index: true
  },           // fraud case ID / related txn
  fileHash: { 
    type: String, 
    required: true 
  },       // hex string (sha256)
  walletAddress: { 
    type: String, 
    required: true,
    index: true
  },  // who uploaded
  uploaderRole: { 
    type: String, 
    enum: ["BANK", "LEA"], 
    required: true 
  },
  fileName: { 
    type: String, 
    required: true 
  },
  evidenceType: { 
    type: String, 
    required: true 
  },   // pdf, image, csv, log...
  chainId: { 
    type: Number, 
    default: 1 
  },
  onChainTxHash: {
    type: String,
    default: null
  },
  evidenceId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Compound index for unique txId + fileHash combination
EvidenceSchema.index({ txId: 1, fileHash: 1 }, { unique: true });

// Index for wallet address lookups
EvidenceSchema.index({ walletAddress: 1, createdAt: -1 });

module.exports = mongoose.model('Evidence', EvidenceSchema);

