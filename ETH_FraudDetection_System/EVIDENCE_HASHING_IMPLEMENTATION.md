# ✅ Evidence Hashing Implementation - Complete

## 📋 Implementation Summary

All required files have been created/updated to implement secure evidence hashing with SHA-256, MongoDB storage, and comprehensive validation.

---

## 📁 Files Created/Updated

### 1. **backend/middleware/uploadEvidence.js** ✅ NEW
**Purpose:** Centralized multer configuration for evidence file uploads

**Features:**
- ✅ File storage in `uploads/evidence/` directory
- ✅ Max file size: 25 MB
- ✅ Allowed MIME types:
  - `application/pdf` (PDF)
  - `image/png`, `image/jpeg`, `image/jpg` (Images)
  - `text/csv` (CSV)
  - `application/json` (JSON)
  - `text/plain` (TXT, LOG)
- ✅ File filter with proper error handling
- ✅ Error handler middleware for multer errors

### 2. **backend/utils/hashFile.js** ✅ VERIFIED
**Purpose:** SHA-256 file hashing utility

**Implementation:**
- ✅ Uses Node.js `crypto.createHash("sha256")`
- ✅ Reads file as stream (efficient for large files)
- ✅ Returns hex string prefixed with `0x`
- ✅ Example output: `0x91cc95305db5c3aec826ae...`

**Function:**
```javascript
sha256File(filePath) → Promise<string>
// Returns: "0x" + hex string
```

### 3. **backend/models/Evidence.js** ✅ VERIFIED
**Purpose:** MongoDB schema for evidence metadata

**Fields:**
- ✅ `txId` (String, required, indexed)
- ✅ `fileHash` (String, required) - SHA-256 with 0x prefix
- ✅ `walletAddress` (String, required, indexed)
- ✅ `uploaderRole` (String, enum: ["BANK", "LEA"], required)
- ✅ `evidenceType` (String, required)
- ✅ `fileName` (String, required)
- ✅ `createdAt` (Date, default: Date.now)

**Unique Constraint:**
- ✅ Compound unique index on `(txId, fileHash)` - prevents duplicates

**Note:** Does NOT store file contents, only metadata + hash

### 4. **backend/routes/evidence.js** ✅ UPDATED
**Purpose:** Express route handler for evidence upload

**Route: POST /api/evidence/upload**

**Features:**
- ✅ Accepts form-data with fields: `file`, `txId`, `walletAddress`, `uploaderRole`, `evidenceType`
- ✅ Comprehensive validation (see below)
- ✅ SHA-256 hashing via `evidenceService`
- ✅ MongoDB storage via `evidenceService`
- ✅ Proper error handling with try/catch
- ✅ File cleanup on errors
- ✅ Standardized JSON responses

**Success Response:**
```json
{
  "status": "SUCCESS",
  "message": "Evidence hashed and stored.",
  "txId": "TEST-CASE-001",
  "fileHash": "0x91cc95305db5c3aec826ae...",
  "uploaderRole": "BANK"
}
```

**Error Response Format:**
```json
{
  "status": "ERROR",
  "message": "Invalid walletAddress."
}
```

---

## ✅ Validation Rules Implemented

### 1. **File Validation**
- ✅ File required (rejects if missing)
- ✅ File type validation (MIME type check)
- ✅ File size limit: 25 MB max
- ✅ Error: `"File missing."`
- ✅ Error: `"Unsupported file type."`
- ✅ Error: `"File bigger than 25 MB."`

### 2. **Field Validation**
- ✅ All required fields checked: `txId`, `walletAddress`, `uploaderRole`, `evidenceType`
- ✅ Error: `"Missing txId."` (or whichever field is missing)

### 3. **Ethereum Address Validation**
- ✅ Pattern: `/^0x[a-fA-F0-9]{40}$/`
- ✅ Trims whitespace before validation
- ✅ Error: `"Invalid walletAddress."`

### 4. **Uploader Role Validation**
- ✅ Must be exactly `"BANK"` or `"LEA"` (case-sensitive)
- ✅ Error: `"Invalid uploaderRole."`

### 5. **Evidence Type Validation**
- ✅ Must be one of: `"pdf"`, `"image"`, `"csv"`, `"log"` (lowercase)
- ✅ Error: `"Unsupported file type."`

### 6. **Duplicate Prevention**
- ✅ Checks for existing `(txId, fileHash)` combination
- ✅ Error: `"Duplicate evidence."` (409 status)

---

## 🔒 Hash Implementation

**Location:** `backend/utils/hashFile.js`

**Process:**
1. Opens file as read stream
2. Creates SHA-256 hash using `crypto.createHash("sha256")`
3. Updates hash with each chunk of data
4. Returns hex string prefixed with `0x`

**Properties:**
- ✅ Identical files produce identical hashes
- ✅ Changed files produce different hashes
- ✅ Prefix: `0x` (required format)
- ✅ Length: 66 characters (`0x` + 64 hex chars)

---

## 📊 Database Schema

**Model:** `Evidence`

**Indexes:**
1. ✅ `txId` - individual index (for lookups)
2. ✅ `walletAddress` - individual index (for lookups)
3. ✅ `(txId, fileHash)` - compound unique index (prevents duplicates)
4. ✅ `(walletAddress, createdAt)` - compound index (for sorted queries)

**Storage:**
- ✅ Only metadata stored (NO file contents)
- ✅ File hash stored as hex string with `0x` prefix
- ✅ Timestamps automatically managed

---

## 🔄 Upload Flow

```
1. Frontend sends POST /api/evidence/upload with form-data
   ↓
2. Multer middleware receives file
   - Validates MIME type
   - Checks file size (25 MB)
   - Stores temporarily in uploads/evidence/
   ↓
3. Route handler validates:
   - File present
   - All required fields
   - Ethereum address format
   - uploaderRole (BANK/LEA)
   - evidenceType (pdf/image/csv/log)
   ↓
4. EvidenceService processes:
   - Computes SHA-256 hash using hashFile.js
   - Checks for duplicates (txId + fileHash)
   - Saves metadata to MongoDB
   ↓
5. Returns JSON response:
   - SUCCESS: { status, message, txId, fileHash, uploaderRole }
   - ERROR: { status: "ERROR", message: "..." }
```

---

## 🧪 Testing

### Test Success Case:
```bash
curl -X POST http://localhost:5000/api/evidence/upload \
  -F "file=@test.pdf" \
  -F "txId=TEST-001" \
  -F "walletAddress=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" \
  -F "uploaderRole=BANK" \
  -F "evidenceType=pdf"
```

**Expected Response:**
```json
{
  "status": "SUCCESS",
  "message": "Evidence hashed and stored.",
  "txId": "TEST-001",
  "fileHash": "0x91cc95305db5c3aec826ae...",
  "uploaderRole": "BANK"
}
```

### Test Error Cases:

**Missing File:**
```json
{
  "status": "ERROR",
  "message": "File missing."
}
```

**Invalid Address:**
```json
{
  "status": "ERROR",
  "message": "Invalid walletAddress."
}
```

**File Too Large:**
```json
{
  "status": "ERROR",
  "message": "File bigger than 25 MB."
}
```

**Unsupported File Type:**
```json
{
  "status": "ERROR",
  "message": "Unsupported file type."
}
```

---

## ✅ Requirements Checklist

- [x] POST /api/evidence/upload route
- [x] SHA-256 hashing with 0x prefix
- [x] MongoDB storage (metadata only)
- [x] Unique constraint (txId + fileHash)
- [x] File validation (type, size)
- [x] Field validation (all required fields)
- [x] Ethereum address validation
- [x] uploaderRole validation (BANK/LEA)
- [x] evidenceType validation (pdf/image/csv/log)
- [x] JSON error responses
- [x] JSON success responses
- [x] Multer configuration (middleware)
- [x] File cleanup on errors
- [x] Try/catch error handling
- [x] Modular design for future blockchain integration

---

## 🚀 Next Steps

### 1. **Restart Backend Server**
```bash
cd backend
# Stop current server (Ctrl+C)
npm start
```

### 2. **Verify Route is Loaded**
Look for in console:
```
✅ Evidence routes loaded: /api/evidence/upload, ...
✅ Server running on port 5000
```

### 3. **Test Endpoint**
Open in browser: `http://localhost:5000/api/evidence/upload`

Should see:
```json
{
  "status": "OK",
  "message": "Use POST with form-data and a file to upload evidence."
}
```

### 4. **Test Upload from Frontend**
- Use the Evidence Hashing tab
- Fill in the form and upload a file
- Should receive success response with fileHash

---

## 📝 Important Notes

1. **No Blockchain Storage Yet:** As requested, blockchain contract interaction is disabled. Only returns `savedToBlockchain: false` in future implementations.

2. **File Cleanup:** Uploaded files are stored temporarily in `uploads/evidence/` and can be cleaned up after processing if needed.

3. **MongoDB Required:** Evidence uploads require MongoDB connection. Server will continue without MongoDB, but uploads will fail.

4. **Port 5000:** If you get "port already in use" error, kill the existing process:
   ```bash
   netstat -ano | findstr :5000
   taskkill /F /PID <PID_NUMBER>
   ```

---

**All implementation complete!** 🎉

The evidence hashing system is ready to use. Just restart the backend server and start uploading evidence files.

