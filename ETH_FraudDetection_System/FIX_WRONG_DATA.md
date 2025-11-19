# Fix: Wallet Trail Showing Wrong Data (All Zeros)

## Common Issues and Fixes

### Issue 1: Moralis API Key Not Configured

**Symptoms:** All values showing 0, no error messages

**Fix:**
1. Open `backend/.env` file
2. Make sure you have a REAL Moralis API key (not the placeholder)
3. The file should look like:
   ```
   MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your actual key)
   PORT=5000
   ```
4. **Get a free API key:** https://moralis.io/
5. Restart the backend server after updating

**How to Check:**
- Open browser console (F12)
- Try fetching a trail
- Look for error messages in console
- Check backend terminal for warnings

### Issue 2: Backend Server Not Running

**Symptoms:** Cannot connect error, or all zeros

**Fix:**
1. Make sure backend is running: `cd backend && npm start`
2. Test backend: Open `http://localhost:5000/api/trace/health` in browser
3. Should return: `{"status":"ok","service":"Transaction Trail Engine","moralisConfigured":true}`

### Issue 3: Invalid Wallet Address

**Symptoms:** Address with many leading zeros might not exist

**Fix:**
1. Try a known active wallet address, such as:
   - `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` (Vitalik Buterin)
   - `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` (Vitalik Buterin 2)
   - `0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be` (Binance Hot Wallet)

### Issue 4: API Rate Limits

**Symptoms:** Works sometimes, fails other times

**Fix:**
1. Check your Moralis dashboard for quota/rate limits
2. Free tier has limits
3. Wait a few seconds between requests

## Step-by-Step Diagnostic

### Step 1: Check Backend Configuration
```bash
cd backend
type .env
```

Should show:
```
MORALIS_API_KEY=your_actual_key_here (NOT "your_moralis_api_key_here")
PORT=5000
```

### Step 2: Test Backend API
Open in browser: `http://localhost:5000/api/trace/health`

Should return:
```json
{
  "status": "ok",
  "service": "Transaction Trail Engine",
  "moralisConfigured": true
}
```

If `moralisConfigured` is `false`, your API key is not set!

### Step 3: Test Direct API Call
```bash
curl "http://localhost:5000/api/trace/wallet/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb?chain=eth"
```

Should return JSON with transaction data, not empty data.

### Step 4: Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Try fetching a trail
4. Look for:
   - ❌ Red errors
   - ⚠️ Yellow warnings
   - Log messages from the code

### Step 5: Check Backend Terminal
Look for error messages like:
- `⚠️ MORALIS_API_KEY not found`
- `Error fetching native transactions`
- `Moralis API error`

## Quick Fix Checklist

- [ ] Backend `.env` file exists in `backend/` directory
- [ ] `MORALIS_API_KEY` is set to REAL key (not placeholder)
- [ ] Backend server is running (`npm start` in backend/)
- [ ] Frontend can reach backend (test `http://localhost:5000/api/trace/health`)
- [ ] Using a valid, active wallet address
- [ ] Browser console shows no connection errors
- [ ] Backend terminal shows no API key warnings

## If Still Not Working

1. **Check Backend Logs:**
   Look at the terminal where backend is running for error messages

2. **Check Frontend Console:**
   Press F12 in browser, check Console tab for errors

3. **Try Different Wallet:**
   Use a well-known wallet like Vitalik's: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

4. **Verify API Key:**
   - Go to https://moralis.io/
   - Log into your account
   - Check your API key in dashboard
   - Copy it to `backend/.env`

5. **Restart Both Servers:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend again
   - Start frontend again

## Expected Behavior

When working correctly:
- Wallet Summary shows real numbers (not all zeros)
- Transaction count > 0 (if wallet has activity)
- Native balance shows ETH amount
- Timeline shows transactions
- Graph shows connections

If you see all zeros, the API call is likely failing silently. Check browser console and backend terminal for errors!

