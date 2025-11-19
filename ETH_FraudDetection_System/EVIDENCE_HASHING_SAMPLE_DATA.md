# 📄 Evidence Hashing - Sample Test Data

## ✅ Sample Data for Testing

### Sample Transaction/Case IDs

Use these format examples for `txId`:

```
CASE-2024-001
TX-2024-11-19-12345
FRAUD-REPORT-789
INVESTIGATION-ABC123
CASE-ETH-0x742d35cc6634c0532925a3b844bc9e7595f0beb
LEA-2024-1123
BANK-ALERT-456
```

### Sample Wallet Addresses (Valid Ethereum Addresses)

Use these well-known addresses for testing:

```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
0x0000000000001ff3684f28c67538d4d072c22734
0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be
0x28c6c06298d514db089934071355e5743bf21d60
```

### Sample Upload Form Data

#### Example 1: Bank Reporting Fraud
```
Transaction/Case ID: CASE-2024-001
Wallet Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Uploader Role: BANK
Evidence Type: pdf
File: Any PDF file (invoices, statements, etc.)
```

#### Example 2: LEA Investigation
```
Transaction/Case ID: LEA-2024-1123
Wallet Address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Uploader Role: LEA
Evidence Type: image
File: Screenshot image (JPG, PNG)
```

#### Example 3: CSV Transaction Log
```
Transaction/Case ID: TX-2024-11-19-12345
Wallet Address: 0x0000000000001ff3684f28c67538d4d072c22734
Uploader Role: BANK
Evidence Type: csv
File: CSV file with transaction data
```

#### Example 4: Application Log
```
Transaction/Case ID: INVESTIGATION-ABC123
Wallet Address: 0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be
Uploader Role: LEA
Evidence Type: log
File: Text file (.txt or .log)
```

## 🧪 Quick Test Workflow

### Test 1: Upload and Verify (Same File)

1. **Upload:**
   - Case ID: `TEST-CASE-001`
   - Wallet: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Role: `BANK`
   - File: Any PDF file (create a test PDF or use existing)
   - Type: `pdf`

2. **Verify (Same File):**
   - Upload the SAME file
   - Case ID: `TEST-CASE-001`
   - Should show: ✅ "Authentic Evidence"

3. **Verify (Different File):**
   - Upload a DIFFERENT file
   - Case ID: `TEST-CASE-001`
   - Should show: ❌ "Tampered or Not Found"

### Test 2: Search Evidence

**Search by Transaction ID:**
```
Search Type: "Search by Transaction/Case ID"
Search Value: TEST-CASE-001
```

**Search by Wallet:**
```
Search Type: "Search by Wallet Address"
Search Value: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## 📋 Real-World Example Scenarios

### Scenario 1: Bank Reports Suspicious Transaction

```
Quick Upload Form:
- Transaction/Case ID: BANK-SUSP-2024-1123
- Wallet Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
- Uploader Role: BANK

Then click "Open Upload Modal" and upload:
- File: suspicious_transaction_statement.pdf
- Evidence Type: pdf
```

### Scenario 2: LEA Collects Screenshot Evidence

```
Quick Upload Form:
- Transaction/Case ID: LEA-EVIDENCE-456
- Wallet Address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
- Uploader Role: LEA

Then click "Open Upload Modal" and upload:
- File: wallet_activity_screenshot.png
- Evidence Type: image
```

### Scenario 3: Transaction Log Analysis

```
Quick Upload Form:
- Transaction/Case ID: ANALYSIS-2024-11-19
- Wallet Address: 0x0000000000001ff3684f28c67538d4d072c22734
- Uploader Role: BANK

Then click "Open Upload Modal" and upload:
- File: transaction_log.csv
- Evidence Type: csv
```

## 🎯 Complete Test Example

### Step 1: Create a Test File

Create a simple text file named `test_evidence.txt` with content:
```
Fraud Evidence Document
Case ID: TEST-CASE-001
Date: 2024-11-19
Description: Suspicious wallet activity detected
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Amount: 5.5 ETH
```

### Step 2: Upload Evidence

1. Go to "Evidence Hashing" tab
2. Fill Quick Upload Form:
   - Transaction/Case ID: `TEST-CASE-001`
   - Wallet Address: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`
   - Uploader Role: `BANK`
3. Click "Open Upload Modal"
4. Select your `test_evidence.txt` file
5. Evidence Type: `log`
6. Click "Upload Evidence"

### Step 3: Search Evidence

1. In Search section, select "Search by Transaction/Case ID"
2. Enter: `TEST-CASE-001`
3. You should see your uploaded evidence in the list

### Step 4: Verify Evidence

1. Click "Verify Evidence" button
2. Upload the SAME `test_evidence.txt` file
3. Enter Case ID: `TEST-CASE-001`
4. Click "Verify"
5. Should show: ✅ "Authentic Evidence"

### Step 5: Test Tamper Detection

1. Modify `test_evidence.txt` (add a line, change something)
2. Click "Verify Evidence"
3. Upload the MODIFIED file
4. Enter Case ID: `TEST-CASE-001`
5. Click "Verify"
6. Should show: ❌ "Tampered or Not Found"

## 📝 Sample Form Values

Copy and paste these directly:

### For Testing Upload:
```
Case ID: TEST-001
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Role: BANK
```

### For Testing Verification:
```
Case ID: TEST-001
File: (same file you uploaded)
```

### For Testing Search:
```
By TX ID: TEST-001
By Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## ⚠️ Important Notes

1. **Case IDs**: Can be any string, but keep them unique for your testing
2. **Wallet Addresses**: Must be valid Ethereum addresses (42 characters, starts with 0x)
3. **File Types**: Supported types are:
   - PDF (`.pdf`)
   - Images (`.jpg`, `.jpeg`, `.png`, `.gif`)
   - CSV (`.csv`)
   - Log/TXT (`.txt`, `.log`)
4. **File Size**: Maximum 25 MB
5. **Case Sensitivity**: File hashes are case-sensitive, so the exact same file will verify correctly

## 🎬 Quick Test Checklist

- [ ] Upload a PDF file with Case ID `DEMO-001`
- [ ] Search for evidence by Case ID `DEMO-001`
- [ ] Verify the same file (should be authentic)
- [ ] Modify the file and verify again (should show tampered)
- [ ] Upload an image file with Case ID `DEMO-002`
- [ ] Search by wallet address
- [ ] Test with BANK and LEA roles

Happy Testing! 🚀

