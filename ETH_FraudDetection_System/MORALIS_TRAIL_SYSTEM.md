# Moralis Transaction Trail Engine

Complete on-chain transaction trail engine using Moralis API, similar to Arkham Intelligence.

## Overview

This system provides comprehensive blockchain transaction analysis by:
- Fetching all native transactions via Moralis API
- Retrieving ERC20 token transfers
- Building interactive money flow graphs
- Detecting risk patterns (CEX interactions, mixers, bridges)
- Generating human-readable timelines

## Setup

### Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `backend/.env`:
```env
PORT=5000
MORALIS_API_KEY=your_moralis_api_key_here
ETHEREUM_RPC_URL=https://eth.llamarpc.com
```

3. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. (Optional) Configure API URL in `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

3. Start the frontend:
```bash
npm start
```

## API Endpoints

### GET /api/trace/wallet/:address

Main endpoint to extract complete transaction trail.

**Query Parameters:**
- `chain` (optional): Chain ID (default: `eth`)
  - Options: `eth`, `polygon`, `bsc`, `arbitrum`, `optimism`
- `maxHops` (optional): Maximum recursion depth (default: `2`)

**Example Request:**
```bash
curl http://localhost:5000/api/trace/wallet/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb?chain=eth&maxHops=2
```

**Response Structure:**
```json
{
  "success": true,
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
  "chain": "eth",
  "summary": {
    "address": "0x...",
    "nativeBalance": "1.234567",
    "tokenCount": 5,
    "totalTransactions": 150,
    "totalERC20Transfers": 200,
    "totalValueIn": 10.5,
    "totalValueOut": 8.3,
    "netValue": 2.2
  },
  "transactions": [...],
  "erc20Transfers": [...],
  "graph": {
    "nodes": [...],
    "edges": [...]
  },
  "riskFlags": [...],
  "timeline": [...]
}
```

## Features

### 1. Transaction Timeline
- Unified chronological view of all transactions
- Filters for incoming/outgoing transactions
- Sort by date (newest/oldest)
- Visual indicators for transaction types

### 2. Money Flow Graph
- Interactive force-directed graph
- Nodes represent wallets/contracts/tokens
- Edges represent transfers with values
- Color-coded by node type:
  - Red: Main wallet
  - Orange: CEX
  - Dark Red: Mixer
  - Purple: Bridge
  - Blue: Wallet
  - Cyan: Token

### 3. Risk Analysis
- Automatic detection of:
  - CEX interactions
  - Mixer usage (Tornado Cash)
  - Bridge usage
  - Rapid activity patterns
  - Fresh wallet detection
- Overall risk score calculation
- Severity levels: High, Medium, Low

### 4. Token Summary Table
- Aggregate ERC20 token statistics
- Total in/out flows
- Net flow calculations
- Sortable columns

## Component Structure

### Backend Components

- `services/moralisService.js`: Moralis API wrapper
- `services/moralisTrailEngine.js`: Transaction trail processing engine
- `routes/trace.js`: API endpoint handlers

### Frontend Components

- `WalletTrailFetcher.js`: Address input and API call
- `TransactionTimeline.js`: Timeline visualization
- `MoneyFlowGraph.js`: Interactive graph visualization
- `TokenTable.js`: Token summary table
- `RiskAnalysis.js`: Risk indicators display
- `WalletIntelligenceDashboard.js`: Main dashboard integrating all components

## Risk Detection

The system automatically detects:

1. **CEX Interactions**: Identifies transactions with known exchange addresses
2. **Mixer Usage**: Detects interactions with Tornado Cash and similar mixers
3. **Bridge Usage**: Identifies cross-chain bridge transactions
4. **Rapid Activity**: Flags high-frequency incoming/outgoing patterns
5. **Fresh Wallets**: Identifies recently created wallets

## Graph Structure

The graph output follows this format:

```json
{
  "nodes": [
    {
      "id": "0xabc...",
      "type": "wallet",
      "label": "0xabc..."
    }
  ],
  "edges": [
    {
      "from": "0xabc...",
      "to": "0x123...",
      "value": "0.52 ETH",
      "valueUsd": 1040,
      "hash": "0x...",
      "type": "native"
    }
  ]
}
```

## Usage

1. Navigate to the Wallet Intelligence dashboard in the frontend
2. Enter a wallet address (must be valid Ethereum address)
3. Select the chain (default: Ethereum)
4. Click "Fetch Trail"
5. View:
   - Summary statistics
   - Risk analysis
   - Interactive money flow graph
   - Transaction timeline
   - Token summary table

## Known Exchange Addresses

The system includes a comprehensive list of known exchange addresses for:
- Binance
- Coinbase
- Kraken
- FTX (historical)

## Known Mixer Addresses

Detection includes addresses for:
- Tornado Cash (various pools)
- Other mixer contracts

## Limitations

1. **Moralis API Rate Limits**: Subject to your Moralis plan limits
2. **Pagination**: Currently fetches up to 500 transactions/transfers per request
3. **Recursion Depth**: Limited to 2 hops by default (configurable)
4. **USD Pricing**: Approximate calculations; Moralis provides better pricing data

## Future Enhancements

- [ ] Multi-hop recursive tracing
- [ ] NFT transfer detection and visualization
- [ ] Smart contract interaction analysis
- [ ] Export functionality (CSV, JSON)
- [ ] Real-time updates via WebSocket
- [ ] Comparison between multiple wallets
- [ ] Historical balance tracking

## Troubleshooting

### Backend Issues

1. **Moralis API Key Error**:
   - Ensure `MORALIS_API_KEY` is set in `.env`
   - Verify the key is valid and has sufficient quota

2. **CORS Issues**:
   - Backend CORS is enabled for all origins in development
   - For production, configure allowed origins

### Frontend Issues

1. **Graph Not Rendering**:
   - Ensure `react-force-graph-2d` is installed
   - Check browser console for errors

2. **API Connection Failed**:
   - Verify backend is running on port 5000
   - Check `REACT_APP_API_URL` environment variable

## License

This system is part of the ETH Fraud Detection System project.

