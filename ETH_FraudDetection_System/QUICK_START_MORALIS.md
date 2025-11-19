# 🚀 Quick Start Guide - Moralis Transaction Trail System

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **Moralis API Key** - [Get one here](https://moralis.io/)
3. **npm** (comes with Node.js)

## Step 1: Get Moralis API Key

1. Go to [moralis.io](https://moralis.io/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API Key (starts with something like `eyJ...`)

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd ETH_FraudDetection_System/ETH_FraudDetection_System/backend
```

### 2.2 Install Dependencies
```bash
npm install
```

This will install:
- express
- cors
- axios
- moralis
- ethers
- dotenv
- and other dependencies

### 2.3 Create Environment File

Create a file named `.env` in the `backend` directory:

**Windows (Command Prompt):**
```cmd
cd backend
type nul > .env
notepad .env
```

**Windows (PowerShell):**
```powershell
cd backend
New-Item -ItemType File -Name .env
notepad .env
```

**Linux/Mac:**
```bash
cd backend
touch .env
nano .env
```

Add the following content to `.env`:
```env
PORT=5000
MORALIS_API_KEY=your_moralis_api_key_here
ETHEREUM_RPC_URL=https://eth.llamarpc.com
ETHEREUM_WS_URL=
CHAIN_NAME=ethereum
```

**⚠️ IMPORTANT:** Replace `your_moralis_api_key_here` with your actual Moralis API key!

### 2.4 Start Backend Server

```bash
npm start
```

You should see:
```
🚀 Initializing Blockchain Monitoring Service...
📍 Chain: ethereum
🔗 RPC URL: https://eth.llamarpc.com
✅ Server running on port 5000
📡 WebSocket server ready: ws://localhost:5000
🌐 HTTP API: http://localhost:5000
```

**Keep this terminal window open!**

## Step 3: Frontend Setup

### 3.1 Open a NEW Terminal Window

Keep the backend running, open a new terminal/command prompt.

### 3.2 Navigate to Frontend Directory
```bash
cd ETH_FraudDetection_System/ETH_FraudDetection_System/frontend
```

### 3.3 Install Dependencies
```bash
npm install
```

This will install:
- react
- react-dom
- axios
- react-force-graph-2d
- moralis
- and other dependencies

### 3.4 (Optional) Configure Frontend Environment

Create a file named `.env` in the `frontend` directory if you need to change the API URL:

```env
REACT_APP_API_URL=http://localhost:5000
```

**Note:** This is optional - it defaults to `http://localhost:5000` if not set.

### 3.5 Start Frontend Server

```bash
npm start
```

The React app will automatically open in your browser at `http://localhost:3001`

**If it doesn't open automatically, manually navigate to:** `http://localhost:3001`

## Step 4: Use the System

1. **The browser should open automatically** to `http://localhost:3001`
2. **Navigate to "Wallet Intelligence"** - it should be selected by default
3. **Enter a wallet address** - try this example:
   ```
   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   ```
4. **Select chain** (default: Ethereum)
5. **Click "Fetch Trail"**
6. **Wait for results** - The system will:
   - Fetch transactions from Moralis API
   - Build the graph structure
   - Analyze risk patterns
   - Display timeline, graph, and statistics

## Troubleshooting

### Backend Won't Start

**Error: `MORALIS_API_KEY not found`**
- Make sure you created the `.env` file in the `backend` directory
- Check that `MORALIS_API_KEY=your_key_here` is in the file
- Restart the backend server

**Error: `Port 5000 already in use`**
- Another application is using port 5000
- Change the port in `backend/.env`: `PORT=5001`
- Or stop the other application

**Error: `Cannot find module`**
- Run `npm install` again in the backend directory
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### Frontend Won't Start

**Error: `Port 3001 already in use`**
- Change the port in `frontend/.env`: `PORT=3002`
- Or modify `frontend/package.json`: Change `"start": "set PORT=3001 && react-scripts start"` to `"start": "set PORT=3002 && react-scripts start"`

**Error: `Cannot find module`**
- Run `npm install` again in the frontend directory
- Delete `node_modules` folder and `package-lock.json`, then run `npm install`

### API Errors in Browser

**Error: `Failed to fetch transaction trail`**
- Make sure the backend is running (check terminal for `✅ Server running on port 5000`)
- Check browser console (F12) for detailed error messages
- Verify your Moralis API key is correct and has quota remaining
- Test the API directly: Open `http://localhost:5000/api/trace/health` in browser

**Error: `Moralis API error`**
- Your API key might be invalid or expired
- Check your Moralis dashboard for API quota/limits
- Verify the API key in `backend/.env` is correct

### Graph Not Rendering

- Check browser console (F12) for errors
- Make sure `react-force-graph-2d` is installed: `npm install react-force-graph-2d`
- Try refreshing the page

## Testing the API Directly

You can test the backend API directly using curl or your browser:

### Health Check
```bash
curl http://localhost:5000/api/trace/health
```

Or open in browser: `http://localhost:5000/api/trace/health`

### Fetch Trail (Example)
```bash
curl "http://localhost:5000/api/trace/wallet/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb?chain=eth&maxHops=2"
```

## Common Commands

### Stop Servers
- Press `Ctrl + C` in the terminal where the server is running
- Or close the terminal window

### Restart Servers
1. Stop the server (`Ctrl + C`)
2. Start again (`npm start`)

### Check if Backend is Running
Open: `http://localhost:5000/health` in browser
Should return: `{"status":"ok",...}`

### Check if Frontend is Running
Open: `http://localhost:3001` in browser
Should show the application interface

## Project Structure

```
ETH_FraudDetection_System/
├── backend/
│   ├── .env                    ← CREATE THIS FILE
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   └── trace.js           ← New trace endpoint
│   └── services/
│       ├── moralisService.js  ← Moralis API wrapper
│       └── moralisTrailEngine.js ← Trail processing
└── frontend/
    ├── src/
    │   ├── App.js
    │   └── components/
    │       ├── WalletIntelligenceDashboard.js ← Main dashboard
    │       ├── WalletTrailFetcher.js
    │       ├── TransactionTimeline.js
    │       ├── MoneyFlowGraph.js
    │       ├── TokenTable.js
    │       └── RiskAnalysis.js
    └── package.json
```

## Need Help?

1. Check the browser console (F12) for errors
2. Check backend terminal for error messages
3. Verify all environment variables are set correctly
4. Ensure both servers are running (backend on 5000, frontend on 3001)
5. Test API endpoints directly using curl or browser

## Example Wallet Addresses to Test

- `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` - Vitalik Buterin's wallet
- `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` - Vitalik Buterin's other wallet
- `0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be` - Binance Hot Wallet

**Note:** Be patient - fetching and processing large transaction histories can take 10-30 seconds depending on wallet activity.

