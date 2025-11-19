# 🔍 Check Backend Status - Quick Guide

## Issue: "Cannot GET /api/evidence/upload"

This error means the backend server is **not running** or **routes are not loaded**.

## ✅ Quick Fix Steps

### Step 1: Check if Backend is Running

**Check Health Endpoint:**
Open in browser: `http://localhost:5000/health`

- ✅ **If it works**: Backend is running, but routes might not be loaded
- ❌ **If it fails**: Backend is NOT running

### Step 2: Check Backend Console

Look for these messages in the backend terminal:

✅ **Should see:**
```
✅ Evidence routes loaded: /api/evidence/upload, /api/evidence/verify, ...
✅ Server running on port 5000
```

❌ **If you DON'T see:**
```
✅ Evidence routes loaded: ...
```
Then the routes are NOT loaded - you need to restart!

### Step 3: Restart Backend

**If backend is NOT running or routes are NOT loaded:**

1. **Stop the backend:**
   - Find the terminal running backend
   - Press `Ctrl + C`
   - Or close the terminal window

2. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Wait for these messages:**
   ```
   ✅ Evidence routes loaded: /api/evidence/upload, /api/evidence/verify, ...
   ✅ Server running on port 5000
   ```

### Step 4: Test Again

**Test Health:**
- Open: `http://localhost:5000/health`
- Should see: `{"status":"ok",...}`

**Test Evidence Endpoint:**
- Open: `http://localhost:5000/api/evidence/upload`
- Should see: `{"status":"OK","message":"Use POST with form-data..."}`

## 🐛 Troubleshooting

### If Health Endpoint Works but Evidence Endpoint Doesn't:

**Check backend console for errors:**
- Look for: `❌ Error loading route`
- Look for: `Cannot find module`
- Look for: Any red error messages

**Common issues:**
1. **Missing multer package:**
   ```bash
   cd backend
   npm install multer
   ```

2. **Routes not registering:**
   - Make sure `backend/routes/evidence.js` exists
   - Make sure `server.js` has: `app.use('/api/evidence', evidenceRoutes);`

3. **Syntax errors in route file:**
   - Check backend console for JavaScript errors
   - Verify file is saved correctly

### If Backend Won't Start:

**Check for errors:**
```bash
cd backend
node server.js
```

Look for:
- ❌ Port already in use
- ❌ Cannot find module
- ❌ Syntax errors

**Fix port conflict:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID_NUMBER> /F
```

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Backend console shows: `✅ Evidence routes loaded`
2. ✅ `http://localhost:5000/health` returns JSON
3. ✅ `http://localhost:5000/api/evidence/upload` returns JSON status
4. ✅ Frontend can upload evidence without errors

---

**Most likely fix: Just restart the backend server!** 🚀

