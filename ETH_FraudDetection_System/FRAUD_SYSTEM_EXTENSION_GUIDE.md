# Ethereum Fraud Detection System - Extension Guide

## 🎯 Overview

This document describes the three new features added to the Ethereum fraud detection system:

1. **Evidence Hashing** - Upload and verify evidence files on-chain
2. **Wallet Transaction Trail** - Visualize on-chain transaction graphs
3. **Bank Account Freezing** - Link wallets to bank accounts and freeze them

## 📋 New Files Created

### Smart Contract
- `blockchain/contracts/FraudRegistry.sol` - Extended contract with evidence hashing and wallet flagging

### Backend Models
- `backend/models/Evidence.js` - MongoDB model for evidence records
- `backend/models/BankAccount.js` - MongoDB model for bank account records

### Backend Services
- `backend/services/evidenceService.js` - Evidence upload and verification logic
- `backend/services/bankService.js` - Bank account management and freezing
- `backend/services/enhancedTrailService.js` - Transaction trail graph builder

### Backend Routes
- `backend/routes/evidence.js` - Evidence upload/verify endpoints
- `backend/routes/bank.js` - Bank account management endpoints
- `backend/routes/enhancedTrail.js` - Transaction trail graph endpoint

### Backend Utils
- `backend/utils/hashFile.js` - SHA-256 file hashing utilities
- `backend/web3/fraudRegistry.js` - Web3 contract integration helper

### Frontend Components
- `frontend/src/components/EvidenceUploadModal.js` - Evidence upload UI
- `frontend/src/components/EvidenceVerifyModal.js` - Evidence verification UI
- `frontend/src/components/TrailGraphView.js` - Transaction trail graph visualization
- `frontend/src/components/BankAccountPanel.js` - Bank account management UI

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

New dependencies added:
- `mongoose` - MongoDB ODM
- `multer` - File upload handling
- `crypto` - Built-in Node.js crypto (for hashing)

### 2. Configure Environment Variables

Create or update `backend/.env`:

```env
# Existing
PORT=5000
MORALIS_API_KEY=your_moralis_key
ETHEREUM_RPC_URL=https://eth.llamarpc.com

# New - MongoDB
MONGODB_URI=mongodb://localhost:27017/fraud-detection

# New - Web3 Contract
RPC_URL=https://eth.llamarpc.com
PRIVATE_KEY=your_private_key_here  # For contract interactions
FRAUD_REGISTRY_ADDRESS=0x...  # Deployed contract address
```

### 3. Deploy FraudRegistry Contract

```bash
cd blockchain

# Update hardhat.config.js to include FraudRegistry
# Compile and deploy
npm run compile
npm run deploy
```

Copy the deployed contract address to `backend/.env` as `FRAUD_REGISTRY_ADDRESS`.

### 4. Start MongoDB

Install MongoDB locally or use MongoDB Atlas:

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 5. Start Backend

```bash
cd backend
npm start
```

The server will automatically:
- Connect to MongoDB
- Initialize contract instance
- Register all new routes

### 6. Start Frontend

```bash
cd frontend
npm start
```

## 📚 API Endpoints

### Evidence Management

#### POST /api/evidence/upload
Upload evidence file and store hash on-chain.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: File (PDF, image, CSV, log - max 25MB)
  - `txId`: Transaction/case ID (string)
  - `walletAddress`: Uploader wallet address
  - `uploaderRole`: "BANK" or "LEA"
  - `evidenceType`: "pdf", "image", "csv", "log"

**Response:**
```json
{
  "success": true,
  "evidenceId": "...",
  "txId": "...",
  "fileHash": "0x...",
  "fileName": "...",
  "evidenceType": "pdf",
  "onChainTxHash": "0x...",
  "uploadedAt": "..."
}
```

#### POST /api/evidence/verify
Verify evidence file authenticity.

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  - `file`: File to verify
  - `txId`: Transaction/case ID

**Response:**
```json
{
  "status": "AUTHENTIC" | "TAMPERED_OR_UNKNOWN",
  "fileHash": "0x...",
  "txId": "...",
  "onChainVerified": true,
  "uploadedAt": "..."
}
```

#### GET /api/evidence/tx/:txId
Get all evidence for a transaction/case.

#### GET /api/evidence/wallet/:walletAddress
Get all evidence for a wallet.

### Bank Account Management

#### POST /api/bank/link-wallet
Link wallet address to bank account.

**Request:**
```json
{
  "bankAccountId": "ACC123456",
  "holderName": "John Doe",
  "walletAddress": "0x..."
}
```

#### POST /api/bank/freeze
Freeze a bank account.

**Request:**
```json
{
  "bankAccountId": "ACC123456",
  "reason": "Fraud detected",
  "frozenBy": "LEA_USER_ID"
}
```

#### POST /api/bank/unfreeze
Unfreeze a bank account.

**Request:**
```json
{
  "bankAccountId": "ACC123456",
  "unfrozenBy": "LEA_USER_ID"
}
```

#### GET /api/bank/:bankAccountId
Get bank account details.

#### GET /api/bank/wallet/:walletAddress
Get all accounts linked to a wallet.

### Transaction Trail

#### GET /api/enhanced-trail/:address
Get transaction trail graph for a wallet.

**Query Params:**
- `depth`: Maximum depth (1-5, default: 2)
- `limit`: Max transactions (1-200, default: 50)
- `chain`: Chain ID (default: 'eth')

**Response:**
```json
{
  "success": true,
  "address": "0x...",
  "chain": "eth",
  "depth": 2,
  "graph": {
    "nodes": [
      {
        "id": "0x...",
        "label": "0x1234...",
        "type": "wallet",
        "isRoot": true,
        "riskScore": 0
      }
    ],
    "edges": [
      {
        "from": "0x...",
        "to": "0x...",
        "value": "0.5 ETH",
        "valueUsd": 1000,
        "txHash": "0x...",
        "timestamp": 1234567890,
        "type": "native"
      }
    ]
  },
  "summary": {
    "totalTransactions": 10,
    "totalERC20Transfers": 5,
    "totalNodes": 8,
    "totalEdges": 15
  },
  "riskFlags": [],
  "timeline": [...]
}
```

## 🔧 Integration with Existing System

### Evidence Upload in Fraud Flow

When a fraud case is reported:

```javascript
// In your existing fraud reporting component
import EvidenceUploadModal from './components/EvidenceUploadModal';

// Show upload modal when fraud is reported
<EvidenceUploadModal
  txId={fraudCaseId}
  walletAddress={suspiciousWallet}
  uploaderRole="BANK"
  onUploaded={(evidence) => {
    console.log('Evidence uploaded:', evidence);
  }}
  onClose={() => setShowUploadModal(false)}
/>
```

### Bank Account Freezing in LEA Dashboard

```javascript
// In LEA dashboard
import BankAccountPanel from './components/BankAccountPanel';

<BankAccountPanel
  walletAddress={suspiciousWallet}
  onAccountUpdated={(account) => {
    console.log('Account status updated:', account);
  }}
/>
```

### Transaction Trail Visualization

```javascript
// When user clicks on a wallet address
import TrailGraphView from './components/TrailGraphView';

<TrailGraphView
  walletAddress={walletAddress}
  onClose={() => setShowTrail(false)}
/>
```

## 🔐 Security Considerations

1. **File Upload Limits**: 25MB max file size enforced
2. **File Type Validation**: Only PDF, images, CSV, logs allowed
3. **Access Control**: In production, add authentication middleware
4. **Private Key**: Keep `PRIVATE_KEY` secure, never commit to git
5. **MongoDB**: Use authentication and encrypted connections in production

## 📝 Testing

### Test Evidence Upload

```bash
curl -X POST http://localhost:5000/api/evidence/upload \
  -F "file=@evidence.pdf" \
  -F "txId=CASE123" \
  -F "walletAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" \
  -F "uploaderRole=BANK" \
  -F "evidenceType=pdf"
```

### Test Bank Account Freeze

```bash
curl -X POST http://localhost:5000/api/bank/freeze \
  -H "Content-Type: application/json" \
  -d '{
    "bankAccountId": "ACC123456",
    "reason": "Fraud detected",
    "frozenBy": "LEA_USER"
  }'
```

### Test Transaction Trail

```bash
curl "http://localhost:5000/api/enhanced-trail/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb?depth=2&limit=50"
```

## 🎨 Frontend Component Usage

All components are ready to use. Import them in your existing React components:

```javascript
import EvidenceUploadModal from './components/EvidenceUploadModal';
import EvidenceVerifyModal from './components/EvidenceVerifyModal';
import TrailGraphView from './components/TrailGraphView';
import BankAccountPanel from './components/BankAccountPanel';
```

## ⚠️ Important Notes

1. **MongoDB Required**: Some features require MongoDB. The system will continue without it but evidence and bank account features won't work.

2. **Contract Deployment**: Deploy `FraudRegistry.sol` and update `FRAUD_REGISTRY_ADDRESS` in `.env`.

3. **Private Key**: Backend needs a private key with ETH for gas fees when calling contract functions.

4. **File Storage**: Uploaded files are stored in `backend/uploads/evidence/`. In production, consider using cloud storage (S3, etc.).

5. **Moralis API**: Transaction trail uses Moralis API. Ensure `MORALIS_API_KEY` is configured.

## 🔄 Future Enhancements

- [ ] IPFS integration for file storage
- [ ] Real bank API integration (replace simulation)
- [ ] Multi-chain support
- [ ] User authentication and authorization
- [ ] Evidence metadata search
- [ ] Automated wallet flagging based on risk scores
- [ ] Batch operations for bulk account freezing

## 📞 Troubleshooting

### MongoDB Connection Failed
- Check MongoDB is running: `mongod`
- Verify `MONGODB_URI` in `.env`
- System will continue but evidence/bank features won't work

### Contract Call Failed
- Verify `FRAUD_REGISTRY_ADDRESS` is correct
- Check `PRIVATE_KEY` has ETH for gas
- Ensure contract is deployed on the network matching `RPC_URL`

### File Upload Failed
- Check file size (< 25MB)
- Verify file type is allowed
- Check `uploads/evidence/` directory exists and is writable

### Trail Graph Not Loading
- Verify Moralis API key is configured
- Check wallet address format is correct
- Ensure backend is running and accessible

---

All features are now integrated and ready to use! 🎉

