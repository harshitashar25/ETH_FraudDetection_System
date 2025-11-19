# 🔄 Complete Project Restart Guide

## 🛑 Step 1: Stop All Running Processes

### Method 1: Using Task Manager (Easiest)

1. **Open Task Manager**: Press `Ctrl + Shift + Esc`
2. **Find and End these processes:**
   - `node.exe` (might be multiple instances)
   - Look for processes using ports:
     - Port 5000 (Backend)
     - Port 3001 or 3000 (Frontend)
     - Port 8545 (Blockchain/Hardhat node)

3. **End all Node.js processes:**
   - Right-click each `node.exe` process
   - Click "End Task"

### Method 2: Using Command Line

Open PowerShell or Command Prompt as Administrator:

```powershell
# Kill all Node.js processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Or kill processes on specific ports
# Port 5000 (Backend)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Port 3001 (Frontend)
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Port 8545 (Blockchain)
netstat -ano | findstr :8545
taskkill /PID <PID_NUMBER> /F
```

### Method 3: Close Terminal Windows

Simply close all terminal/command prompt windows running:
- Backend server
- Frontend server
- Blockchain node (Hardhat)
- Any other Node processes

---

## 🚀 Step 2: Start Everything Fresh

You'll need **3 separate terminals** for a complete restart:

### Terminal 1: Start Backend Server

```bash
cd backend
npm install  # Only needed if you added new dependencies
npm start
```

**Or use the batch file:**
```bash
cd backend
start-backend.bat
```

**Wait for:**
```
✅ Server running on port 5000
✅ Evidence routes loaded: /api/evidence/upload, ...
```

### Terminal 2: Start Frontend Server

```bash
cd frontend
npm install  # Only needed if you added new dependencies
npm start
```

**Or use the batch file:**
```bash
cd frontend
start-frontend.bat
```

**Wait for:**
```
Compiled successfully!
Local:            http://localhost:3001
```

### Terminal 3: Start Blockchain Node (Optional - only if needed)

```bash
cd blockchain
npm install  # Only needed if you added new dependencies
npm run node
```

**Wait for:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

---

## ✅ Step 3: Verify Everything is Running

### Check Backend:
Open in browser: `http://localhost:5000/health`
- Should return: `{"status":"ok",...}`

### Check Evidence Endpoint:
Open in browser: `http://localhost:5000/api/evidence/upload`
- Should return: `{"status":"OK","message":"Use POST with form-data..."}`

### Check Frontend:
Open in browser: `http://localhost:3001`
- Should show the Fraud Detection System interface

### Check Blockchain (if running):
```bash
curl http://localhost:8545
```

---

## 🎯 Quick Restart Script

I've created batch files to help you restart:

### Windows Batch Files:

1. **`stop-all.bat`** - Stops all Node processes
2. **`start-all.bat`** - Starts all services (runs in separate windows)

---

## 🔍 Troubleshooting

### Port Already in Use:

**Error: "Port 5000 is already in use"**

```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID_NUMBER> /F
```

**Error: "Port 3001 is already in use"**

```bash
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

### Backend Won't Start:

1. **Check .env file exists:**
   ```bash
   cd backend
   # Make sure .env file exists with MORALIS_API_KEY
   ```

2. **Reinstall dependencies:**
   ```bash
   cd backend
   rm -rf node_modules
   npm install
   ```

3. **Check for errors in console:**
   - Look for red error messages
   - Check for missing modules

### Frontend Won't Start:

1. **Clear cache and reinstall:**
   ```bash
   cd frontend
   rm -rf node_modules
   npm cache clean --force
   npm install
   npm start
   ```

2. **Check if port is available:**
   ```bash
   # The frontend will ask to use a different port if 3001 is taken
   ```

### Evidence Upload Still Not Working:

1. **Verify backend is running:**
   - Check: `http://localhost:5000/health`
   - Check console for: `✅ Evidence routes loaded`

2. **Check MongoDB connection:**
   - Backend will continue without MongoDB
   - But evidence uploads need MongoDB
   - Start MongoDB or use MongoDB Atlas

3. **Check backend console logs:**
   - Look for: `📤 POST /api/evidence/upload - Request received`
   - Check for error messages

---

## 📋 Startup Order Checklist

- [ ] All previous processes stopped
- [ ] Backend server started (port 5000)
- [ ] Backend shows "✅ Server running"
- [ ] Evidence routes loaded message appears
- [ ] Frontend server started (port 3001 or 3000)
- [ ] Frontend shows "Compiled successfully"
- [ ] Blockchain node started (if needed, port 8545)
- [ ] All endpoints responding correctly

---

## 🎉 Success Indicators

You'll know everything is working when:

1. ✅ Backend console shows: `✅ Server running on port 5000`
2. ✅ Backend console shows: `✅ Evidence routes loaded`
3. ✅ Frontend opens at `http://localhost:3001`
4. ✅ Health check works: `http://localhost:5000/health`
5. ✅ Evidence endpoint works: `http://localhost:5000/api/evidence/upload`
6. ✅ You can upload evidence from the frontend

---

**Ready to restart? Follow the steps above!** 🚀

