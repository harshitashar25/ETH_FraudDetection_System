# 🚀 How to Run the Moralis Transaction Trail System

## Prerequisites
- Node.js installed ([Download](https://nodejs.org/))
- Moralis API Key ([Get Free Key](https://moralis.io/))

## Quick Start (Windows)

### Option 1: Using Batch Files (Easiest)

1. **Configure Backend**
   - Create `backend/.env` file
   - Add: `MORALIS_API_KEY=your_key_here`

2. **Start Backend**
   - Double-click `backend/start-backend.bat`
   - Wait for: `✅ Server running on port 5000`

3. **Start Frontend** (in a new terminal/folder)
   - Double-click `frontend/start-frontend.bat`
   - Browser opens at `http://localhost:3001`

### Option 2: Using Command Line

#### Terminal 1 - Backend:
```cmd
cd backend
npm install
npm start
```

#### Terminal 2 - Frontend:
```cmd
cd frontend
npm install
npm start
```

## Step-by-Step Guide

### 1. Get Moralis API Key
1. Visit [moralis.io](https://moralis.io/)
2. Sign up (free account)
3. Copy your API Key from dashboard

### 2. Setup Backend

```cmd
cd backend
```

Create `.env` file:
```cmd
echo MORALIS_API_KEY=your_key_here > .env
echo PORT=5000 >> .env
```

Or create manually:
- Create file: `backend/.env`
- Content:
  ```
  MORALIS_API_KEY=your_actual_key_here
  PORT=5000
  ```

Install & Start:
```cmd
npm install
npm start
```

**✅ You should see:** `Server running on port 5000`

### 3. Setup Frontend

Open a **NEW** terminal window:

```cmd
cd frontend
npm install
npm start
```

**✅ Browser opens automatically at:** `http://localhost:3001`

### 4. Use the Application

1. **Select "Wallet Intelligence"** from sidebar (default)
2. **Enter wallet address**, example:
   - `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
3. **Click "Fetch Trail"**
4. **Wait 10-30 seconds** for results
5. **View:**
   - Summary statistics
   - Risk analysis
   - Interactive graph
   - Transaction timeline
   - Token summary

## Troubleshooting

### ❌ "MORALIS_API_KEY not found"
**Fix:** Create `backend/.env` with your API key

### ❌ "Port 5000 already in use"
**Fix:** Change port in `backend/.env` to `PORT=5001`

### ❌ "Cannot find module"
**Fix:** Run `npm install` in that directory

### ❌ "Failed to fetch trail"
**Fix:** 
- Ensure backend is running (check terminal)
- Verify API key is correct
- Check Moralis dashboard for quota

### ❌ Frontend won't open
**Fix:** Manually go to `http://localhost:3001`

## Testing

### Test Backend:
Open browser: `http://localhost:5000/api/trace/health`

Should return:
```json
{"status":"ok","service":"Transaction Trail Engine","moralisConfigured":true}
```

### Test Full Trail:
```
http://localhost:5000/api/trace/wallet/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## Project Structure

```
backend/
├── .env              ← CREATE THIS (add Moralis API key)
├── server.js
├── routes/trace.js   ← Main API endpoint
└── services/
    ├── moralisService.js
    └── moralisTrailEngine.js

frontend/
├── src/
│   └── components/
│       ├── WalletIntelligenceDashboard.js
│       ├── WalletTrailFetcher.js
│       ├── TransactionTimeline.js
│       ├── MoneyFlowGraph.js
│       ├── TokenTable.js
│       └── RiskAnalysis.js
```

## Need Help?

1. **Backend not starting?** Check `backend/.env` exists with API key
2. **Frontend not loading?** Check backend is running on port 5000
3. **API errors?** Verify Moralis API key is valid
4. **Graph not showing?** Check browser console (F12) for errors

## Example Workflow

```
1. Start Backend  →  Terminal: npm start (in backend/)
   ✅ Server running on port 5000

2. Start Frontend →  Terminal: npm start (in frontend/)
   ✅ Browser opens at localhost:3001

3. Use App       →  Enter address → Fetch Trail → View Results
```

**That's it!** The system is now running. 🎉

