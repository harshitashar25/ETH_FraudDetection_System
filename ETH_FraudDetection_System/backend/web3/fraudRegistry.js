const { ethers } = require('ethers');
require('dotenv').config();

// Load contract ABI - adjust path as needed
// For now, we'll create a minimal ABI for the functions we need
const FraudRegistryABI = [
  "function storeEvidenceHash(bytes32 txId, bytes32 fileHash, string calldata evidenceType) external",
  "function getEvidence(bytes32 evidenceId) external view returns (tuple(bytes32 fileHash, address uploader, uint256 uploadedAt, string evidenceType))",
  "function flagWallet(address wallet, string calldata reason) external",
  "function unflagWallet(address wallet) external",
  "function isWalletFlagged(address wallet) external view returns (bool)",
  "function getWalletFlag(address wallet) external view returns (tuple(bool isFlagged, uint256 flaggedAt, string reason, address flaggedBy))",
  "function reportFraudWithWallet(address wallet, bytes32 txId, uint256 riskScore, bool shouldFlag, string calldata flagReason) external",
  "event EvidenceStored(bytes32 indexed txId, bytes32 indexed fileHash, address indexed uploader, string evidenceType)",
  "event WalletFlagged(address indexed wallet, string reason, address indexed flaggedBy)",
  "event WalletUnflagged(address indexed wallet, address indexed unflaggedBy)"
];

let contractInstance = null;

/**
 * Initialize and return contract instance
 */
function getContract() {
  if (contractInstance) {
    return contractInstance;
  }

  // Using public Ethereum RPC endpoints (llamarpc.com is blocked by Cloudflare)
  const rpcUrl = process.env.RPC_URL || process.env.ETHEREUM_RPC_URL || 'https://rpc.ankr.com/eth';
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.FRAUD_REGISTRY_ADDRESS;

  if (!contractAddress) {
    throw new Error('FRAUD_REGISTRY_ADDRESS not set in environment variables');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  if (privateKey) {
    const wallet = new ethers.Wallet(privateKey, provider);
    contractInstance = new ethers.Contract(contractAddress, FraudRegistryABI, wallet);
    console.log('✅ FraudRegistry contract initialized with signer');
  } else {
    // Read-only instance
    contractInstance = new ethers.Contract(contractAddress, FraudRegistryABI, provider);
    console.log('⚠️  FraudRegistry contract initialized in read-only mode (no PRIVATE_KEY)');
  }

  return contractInstance;
}

/**
 * Convert string to bytes32 (using keccak256 hash of string)
 */
function stringToBytes32(str) {
  if (!str) return ethers.ZeroHash;
  // If string is already 32 bytes hex, return it
  if (str.length === 66 && str.startsWith('0x') && /^0x[a-fA-F0-9]{64}$/.test(str)) {
    return str;
  }
  // Hash the string to get bytes32
  return ethers.keccak256(ethers.toUtf8Bytes(str));
}

/**
 * Convert hex string to bytes32 (pad or truncate to 32 bytes)
 */
function hexToBytes32(hex) {
  if (!hex) return ethers.ZeroHash;
  
  // Remove 0x if present
  let cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  
  // Pad or truncate to 64 hex characters (32 bytes)
  if (cleanHex.length < 64) {
    cleanHex = cleanHex.padEnd(64, '0');
  } else if (cleanHex.length > 64) {
    cleanHex = cleanHex.slice(0, 64);
  }
  
  return '0x' + cleanHex;
}

module.exports = {
  getContract,
  stringToBytes32,
  hexToBytes32
};

