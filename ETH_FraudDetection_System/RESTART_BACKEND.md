# 🔄 How to Restart Backend Server

## ⚠️ IMPORTANT: Backend Must Be Restarted

After installing `multer` and updating the evidence routes, **you MUST restart the backend server** for changes to take effect.

## 📋 Step-by-Step Instructions

### Method 1: Using Command Line

1. **Find the terminal running the backend server**
   - Look for a terminal window showing server logs
   - Or check Task Manager for `node.exe` processes

2. **Stop the server**
   - Press `Ctrl + C` in the backend terminal
   - Or close the terminal window

3. **Restart the server**
   ```bash
   cd backend
   npm start
   ```

### Method 2: Using the Batch File (Windows)

1. **Stop the current server** (Ctrl+C)

2. **Run the batch file:**
   ```bash
   cd backend
   start-backend.bat
   ```

### Method 3: Kill Process and Restart

If you can't find the terminal:

1. **Kill the Node process:**
   ```bash
   # Windows PowerShell
   Get-Process node | Stop-Process
   
   # Or use Task Manager:
   # 1. Open Task Manager (Ctrl+Shift+Esc)
   # 2. Find "Node.js" processes
   # 3. End Task
   ```

2. **Restart:**
   ```bash
   cd backend
   npm start
   ```

## ✅ Verify Server is Running

After restarting, check these:

### 1. Check Server Console Output

You should see:
```
✅ Server running on port 5000
📡 WebSocket server ready: ws://localhost:5000
🌐 HTTP API: http://localhost:5000
```

### 2. Test Health Endpoint

Open in browser: `http://localhost:5000/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "chain": "ethereum",
  "trackedAddresses": 0
}
```

### 3. Test Evidence Upload Endpoint (GET)

Open in browser: `http://localhost:5000/api/evidence/upload`

Should return:
```json
{
  "status": "OK",
  "message": "Use POST with form-data and a file to upload evidence."
}
```

## 🐛 Troubleshooting

### If you still get 404 errors:

1. **Check if server is actually running:**
   ```bash
   # Test if port 5000 is listening
   netstat -ano | findstr :5000
   ```

2. **Check for errors in console:**
   - Look for red error messages
   - Check for "Cannot find module" errors
   - Verify multer is installed: `npm list multer`

3. **Verify route is loaded:**
   - Check console for route registration messages
   - Look for any startup errors

4. **Check MongoDB connection:**
   - Server will continue even if MongoDB fails
   - But evidence uploads need MongoDB
   - Check console for MongoDB connection status

### Common Errors:

**Error: Cannot find module 'multer'**
```bash
cd backend
npm install multer
npm start
```

**Error: Port 5000 already in use**
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Error: MongoDB connection failed**
- This is OK - server will continue
- But evidence uploads won't work without MongoDB
- Start MongoDB or use MongoDB Atlas

## 🎯 Quick Test After Restart

1. Open: `http://localhost:5000/api/evidence/upload` (should show JSON)
2. Try uploading evidence from frontend
3. Check backend console for any errors

---

**Once the server is restarted, the evidence upload should work!** ✅

