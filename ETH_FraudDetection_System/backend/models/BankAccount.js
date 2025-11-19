const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
  bankAccountId: { 
    type: String, 
    unique: true, 
    required: true,
    index: true
  },
  holderName: { 
    type: String 
  },
  linkedWallet: { 
    type: String,
    index: true
  },  // Ethereum address
  status: { 
    type: String, 
    enum: ["ACTIVE", "FROZEN"], 
    default: "ACTIVE",
    index: true
  },
  freezeReason: { 
    type: String 
  },
  frozenAt: { 
    type: Date 
  },
  frozenBy: {
    type: String  // LEA user ID or wallet address
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

// Index for wallet lookups
BankAccountSchema.index({ linkedWallet: 1 });

module.exports = mongoose.model('BankAccount', BankAccountSchema);

