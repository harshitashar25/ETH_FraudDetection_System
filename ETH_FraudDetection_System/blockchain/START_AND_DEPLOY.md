# How to Deploy Hardhat Contract

## Step 1: Start Hardhat Local Node

**Terminal 1 - Start the node:**
```bash
cd blockchain
npm run node
```

Wait for output showing:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

**Keep this terminal open!**

## Step 2: Deploy Contract

**Terminal 2 - Deploy (in a NEW terminal):**
```bash
cd blockchain
npm run deploy
```

This will:
- Compile the contract
- Deploy to the local node
- Output the contract address

**Important:** Copy the contract address from the deploy output and update it in `frontend/src/App.js` line 17!

## Quick Deploy Script

If you want to do both in sequence, you can:

**Terminal 1:**
```bash
cd blockchain
npm run node
```

**Terminal 2 (after node starts):**
```bash
cd blockchain
npm run deploy
```

## Troubleshooting

**Error: "Cannot connect to network localhost"**
- Make sure the Hardhat node is running in Terminal 1
- Wait 5-10 seconds after starting the node before deploying

**Error: "Port 8545 already in use"**
- Another Hardhat node is already running
- Kill it or change the port in `hardhat.config.js`

**Error: "SPDX license identifier not provided"**
- This is just a warning, not an error
- To fix, add `// SPDX-License-Identifier: UNLICENSED` to the top of `FraudLedger.sol`

## After Deployment

1. Copy the deployed contract address
2. Update `frontend/src/App.js` line 17:
   ```javascript
   const contractAddress = "YOUR_DEPLOYED_ADDRESS_HERE";
   ```
3. The frontend will now connect to your deployed contract!

