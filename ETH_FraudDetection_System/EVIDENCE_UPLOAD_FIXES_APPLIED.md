# ✅ Evidence Upload Fixes Applied

## Changes Made

### 1. **Added Logging to Evidence Routes** ✅
   - Added console logs when routes are loaded
   - Added request logging for POST /upload endpoint
   - Added success/error logging for debugging
   - This will help you see if requests are reaching the server

### 2. **Created Test Script** ✅
   - `backend/test-evidence-upload.js` - Test script to verify endpoint works
   - Tests both GET and POST endpoints
   - Creates a test file and uploads it

### 3. **Created Restart Guide** ✅
   - `RESTART_BACKEND.md` - Step-by-step guide to restart backend
   - Multiple methods for restarting
   - Troubleshooting tips

## 🚀 Next Steps - YOU MUST DO THIS:

### Step 1: Restart Backend Server

**This is the most important step!** The server must be restarted for changes to take effect.

1. **Stop the current backend server:**
   - Find the terminal running the backend
   - Press `Ctrl + C` to stop it

2. **Restart the server:**
   ```bash
   cd backend
   npm start
   ```

3. **Look for this message in the console:**
   ```
   ✅ Evidence routes loaded: /api/evidence/upload, /api/evidence/verify, ...
   ✅ Server running on port 5000
   ```

### Step 2: Verify Endpoint is Working

**Option A: Test in Browser**
- Open: `http://localhost:5000/api/evidence/upload`
- Should see: `{"status":"OK","message":"Use POST with form-data and a file to upload evidence."}`

**Option B: Run Test Script**
```bash
cd backend
node test-evidence-upload.js
```

**Option C: Check Console Logs**
- When you try to upload from frontend, check backend console
- You should see: `📤 POST /api/evidence/upload - Request received`

### Step 3: Try Uploading from Frontend

1. Go to Evidence Hashing tab
2. Fill in the form:
   - Transaction/Case ID: `TEST-CASE-001`
   - Wallet Address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Uploader Role: `BANK`
   - Evidence Type: `PDF` (will auto-convert to lowercase)
   - File: Select your PDF file

3. Click "Upload Evidence"

4. **Check backend console** - you should see:
   ```
   📤 POST /api/evidence/upload - Request received
      File: Techathon 6 Statements.pdf
      Body fields: { txId: 'TEST-CASE-001', ... }
   ✅ Evidence uploaded successfully
   ```

## 🔍 Troubleshooting

### If you still get 404:

1. **Verify server is running:**
   - Check: `http://localhost:5000/health`
   - Should return JSON with status "ok"

2. **Check console for route loading:**
   - Look for: `✅ Evidence routes loaded: ...`
   - If you don't see this, the route file didn't load

3. **Check for errors:**
   - Look for red error messages in console
   - Check for "Cannot find module" errors
   - Verify multer is installed: `npm list multer`

4. **Verify route is registered:**
   - In `backend/server.js`, line 122 should have:
     ```javascript
     app.use('/api/evidence', evidenceRoutes);
     ```

### If upload fails with validation error:

Check the error message:
- **"Missing required fields"** - Make sure all fields are filled
- **"Invalid Ethereum wallet address"** - Check address format (0x + 40 hex chars)
- **"Invalid uploaderRole"** - Must be exactly "BANK" or "LEA"
- **"Invalid evidenceType"** - Must be "pdf", "image", "csv", or "log"
- **"File too large"** - File must be under 25MB
- **"Invalid file type"** - File must be PDF, PNG, JPEG, CSV, JSON, or TXT/LOG

## 📋 What Was Fixed

✅ GET /api/evidence/upload endpoint added  
✅ Multer properly configured with MIME type validation  
✅ File size limit: 25MB  
✅ All field validations in place  
✅ Ethereum address format validation  
✅ Error responses in JSON format  
✅ Success responses in correct format  
✅ Logging added for debugging  
✅ Test script created  
✅ Restart guide created  

## ⚠️ Important Notes

1. **Backend MUST be restarted** - Changes won't work until server restarts
2. **MongoDB needed** - Evidence uploads require MongoDB connection
3. **File storage** - Files are saved to `backend/uploads/evidence/`
4. **Contract disabled** - Blockchain calls are commented out (returns `savedToBlockchain: false`)

## 🎯 Expected Behavior After Restart

1. **GET request** to `/api/evidence/upload` returns JSON status
2. **POST request** with valid data returns success with fileHash
3. **Backend console** shows request logs
4. **Frontend** shows success message with file hash

---

**After restarting the backend, everything should work!** 🚀

If you still have issues after restarting, check the backend console logs - they will now show detailed information about what's happening.

