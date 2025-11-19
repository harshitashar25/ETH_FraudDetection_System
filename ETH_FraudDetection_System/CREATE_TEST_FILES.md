# 🧪 How to Create Test Files for Evidence Hashing

## Quick Guide to Create Sample Files

### 1. Create a Test PDF

**Windows:**
1. Open Notepad
2. Type: "This is test evidence for Case TEST-001"
3. Save as `test_evidence.txt`
4. Right-click → Print to PDF (or use any PDF printer)
5. Save as `test_evidence.pdf`

**Online:**
- Use any online PDF creator
- Or use Google Docs → Download as PDF

### 2. Create a Test Image

**Windows:**
1. Take a screenshot (Win + Shift + S)
2. Save as `evidence_screenshot.png`

**Or:**
1. Open Paint
2. Draw something or add text: "Evidence for Case TEST-001"
3. Save as `test_evidence.png`

### 3. Create a Test CSV File

**Windows (Notepad):**
```
Date,Transaction,Amount,From,To
2024-11-19,TX001,1.5 ETH,0x742d35...,0xd8dA6B...
2024-11-19,TX002,0.5 ETH,0xd8dA6B...,0x3f5ce5...
```
Save as `test_evidence.csv`

### 4. Create a Test Log File

**Windows (Notepad):**
```
[2024-11-19 10:30:00] Fraud Alert Detected
[2024-11-19 10:30:01] Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
[2024-11-19 10:30:02] Amount: 5.5 ETH
[2024-11-19 10:30:03] Risk Score: 85
[2024-11-19 10:30:04] Status: FLAGGED
```
Save as `test_evidence.log`

## 📋 Ready-to-Use Sample Data

### Minimal Test (Quick Start)

**Form Fields:**
- Case ID: `QUICK-TEST-001`
- Wallet: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
- Role: `BANK`
- File: Any small text file (1-2 lines)
- Type: `log`

### Complete Test Scenario

**Scenario: Bank Reporting Suspicious Activity**

1. **Quick Upload Form:**
   ```
   Case ID: BANK-ALERT-2024-11-19
   Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   Role: BANK
   ```

2. **Upload File:**
   - Create file `bank_alert.txt`:
     ```
     Bank Alert Report
     Date: November 19, 2024
     Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
     Reason: Unusual transaction pattern
     Amount: 10 ETH
     Risk Level: HIGH
     ```
   - Upload with Type: `log`

3. **Verify Later:**
   - Upload the SAME `bank_alert.txt` file
   - Case ID: `BANK-ALERT-2024-11-19`
   - Should verify as authentic

## 🎯 Copy-Paste Ready Values

### For Upload Testing:

```
Case ID Field:
BANK-ALERT-001

Wallet Address Field:
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

OR

0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

OR

0x0000000000001ff3684f28c67538d4d072c22734
```

### For Search Testing:

```
Search by Transaction/Case ID:
BANK-ALERT-001

Search by Wallet Address:
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

### For Verification Testing:

```
Case ID:
BANK-ALERT-001

File:
(Upload the same file you used for upload)
```

## 💡 Pro Tips

1. **Start Simple**: Use a small text file for your first test
2. **Use Real Addresses**: The wallet addresses provided are real Ethereum addresses
3. **Unique Case IDs**: Use unique Case IDs like `TEST-${Date.now()}` to avoid conflicts
4. **Save Files**: Keep the original files so you can verify them later
5. **Test Both Roles**: Try uploading as both BANK and LEA to see the difference

## 🚀 Quick Test (30 seconds)

1. Create a file `test.txt` with content: "Test evidence"
2. In Evidence Hashing tab:
   - Case ID: `QUICK-001`
   - Wallet: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Click "Open Upload Modal"
   - Upload `test.txt`
   - Type: `log`
   - Click "Upload Evidence"
3. Click "Verify Evidence"
   - Upload the SAME `test.txt`
   - Case ID: `QUICK-001`
   - Click "Verify"
4. Should see: ✅ Authentic Evidence

Done! 🎉

