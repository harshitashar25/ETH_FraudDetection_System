# 📋 Mock Data for Evidence Hashing Testing

## 🎯 Ready-to-Use Test Scenarios

### Scenario 1: Bank Fraud Report
**Quick Upload Form:**
```
Transaction/Case ID: BANK-FRAUD-2024-001
Wallet Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Uploader Role: BANK
```

**Upload Modal:**
- Evidence Type: `pdf` or `log`
- File Name: `fraud_report_BANK_001.pdf` (or .txt)
- File Content (if creating text file):
```
FRAUD INVESTIGATION REPORT
Case ID: BANK-FRAUD-2024-001
Report Date: 2024-12-15
Bank: First National Bank
Branch: Main Branch, New York

SUSPICIOUS ACTIVITY:
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Transaction Amount: 25.75 ETH
Transaction Hash: 0xabc123def4567890123456789012345678901234567890123456789012345678
Risk Level: HIGH

DETAILS:
- Customer Account: ACC-123456789
- Account Holder: John Doe
- Flagged Transaction Date: 2024-12-14 14:30:00 UTC
- Pattern: Large transfer to unverified wallet
- Linked to previous suspicious activity
```

---

### Scenario 2: Law Enforcement Investigation
**Quick Upload Form:**
```
Transaction/Case ID: LEA-CASE-2024-002
Wallet Address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Uploader Role: LEA
```

**Upload Modal:**
- Evidence Type: `image` or `log`
- File Name: `wallet_screenshot_LEA_002.png` (or .txt)
- File Content (if creating text file):
```
LAW ENFORCEMENT INVESTIGATION REPORT
Case ID: LEA-CASE-2024-002
Investigation Date: 2024-12-15
Agent: Detective Jane Smith
Department: Cyber Crime Unit

INVESTIGATION FINDINGS:
Wallet Address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Investigation Type: Money Laundering

EVIDENCE COLLECTED:
1. Wallet transaction history screenshot
2. Multiple exchange transfers identified
3. Pattern analysis shows rapid fund movement
4. Connected to 5 other suspicious wallets

RELATED CASE: BANK-FRAUD-2024-001
STATUS: Active Investigation
```

---

### Scenario 3: Transaction Log Analysis
**Quick Upload Form:**
```
Transaction/Case ID: TX-LOG-2024-003
Wallet Address: 0x0000000000001ff3684f28c67538d4d072c22734
Uploader Role: BANK
```

**Upload Modal:**
- Evidence Type: `csv` or `log`
- File Name: `transaction_log_analysis_003.csv` (or .txt)
- File Content (if creating text/CSV file):
```
Transaction Analysis Log
Case ID: TX-LOG-2024-003
Date: 2024-12-15

Wallet,Amount,Date,Type,Destination
0x0000000000001ff3684f28c67538d4d072c22734,10.5 ETH,2024-12-14,Transfer,0xabc123...
0x0000000000001ff3684f28c67538d4d072c22734,5.2 ETH,2024-12-14,Transfer,0xdef456...
0x0000000000001ff3684f28c67538d4d072c22734,8.75 ETH,2024-12-14,Transfer,0x789abc...

ANALYSIS:
- Total Volume: 24.45 ETH in 24 hours
- Pattern: Rapid transfer sequence
- Risk Indicator: HIGH
```

---

### Scenario 4: Multi-Agency Collaboration
**Same Case ID, Different Uploaders:**

#### 4a. Bank Uploads First:
```
Transaction/Case ID: MULTI-CASE-2024-004
Wallet Address: 0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be
Uploader Role: BANK
Evidence Type: pdf
File Name: bank_initial_report_004.pdf
```

#### 4b. LEA Adds Evidence:
```
Transaction/Case ID: MULTI-CASE-2024-004
Wallet Address: 0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be
Uploader Role: LEA
Evidence Type: image
File Name: lea_followup_evidence_004.png
```

---

## 📝 Complete Mock Data Sets

### Mock Case IDs (Copy-Paste Ready)
```
BANK-FRAUD-2024-001
LEA-CASE-2024-002
TX-LOG-2024-003
MULTI-CASE-2024-004
FRAUD-REPORT-005
INVESTIGATION-006
SUSPICIOUS-007
AML-ALERT-008
COMPLIANCE-009
EVIDENCE-010
```

### Mock Wallet Addresses (Valid Ethereum Addresses)
```
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
0x0000000000001ff3684f28c67538d4d072c22734
0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be
0x28c6c06298d514db089934071355e5743bf21d60
0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643
0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
0x8ba1f109551bD432803012645Hac136c220C9E4e
0xdfd5293d8e347dfe59e90efd55b2956a1343963d
0x1234567890123456789012345678901234567890
```

---

## 🧪 Test Workflow with Mock Data

### Test 1: Upload and Verify Same File

**Step 1: Upload**
```
Case ID: TEST-VERIFY-001
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Role: BANK
File: test_file_001.txt (create this file with any content)
Type: log
```

**Step 2: Verify (Same File)**
```
Case ID: TEST-VERIFY-001
File: test_file_001.txt (same file)
Expected: ✅ AUTHENTIC
```

### Test 2: Tamper Detection

**Step 1: Upload**
```
Case ID: TEST-TAMPER-002
Wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Role: BANK
File: original_file.txt
Content: "This is original evidence"
Type: log
```

**Step 2: Modify File**
- Edit `original_file.txt`
- Change content to: "This is MODIFIED evidence"
- Save as `modified_file.txt`

**Step 3: Verify Modified File**
```
Case ID: TEST-TAMPER-002
File: modified_file.txt
Expected: ❌ TAMPERED
```

### Test 3: Search by Case ID

**Upload Multiple Files with Same Case ID:**
```
Case ID: TEST-SEARCH-003
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

Upload 1:
- Role: BANK
- File: evidence_1.pdf
- Type: pdf

Upload 2:
- Role: LEA
- File: evidence_2.png
- Type: image

Upload 3:
- Role: BANK
- File: evidence_3.csv
- Type: csv
```

**Then Search:**
```
Search Type: Transaction/Case ID
Search Value: TEST-SEARCH-003
Expected: 3 evidence records shown
```

### Test 4: Search by Wallet

**Upload Files with Same Wallet:**
```
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb

Upload 1:
- Case ID: CASE-A-001
- Role: BANK
- File: wallet_evidence_1.pdf

Upload 2:
- Case ID: CASE-B-002
- Role: LEA
- File: wallet_evidence_2.png
```

**Then Search:**
```
Search Type: Wallet Address
Search Value: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Expected: 2 evidence records shown (both cases)
```

---

## 📄 Sample File Contents (Copy-Paste Ready)

### Sample PDF Content (Save as .txt for testing)
```
FRAUD INVESTIGATION REPORT
========================================

Case ID: BANK-FRAUD-2024-001
Report Date: December 15, 2024
Bank: First National Bank
Branch ID: NY-001

SUSPICIOUS ACTIVITY DETECTED:
------------------------------
Wallet Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Account Number: ACC-789456123
Account Holder: John Doe
SSN: XXX-XX-1234

Transaction Details:
- Date: 2024-12-14 14:30:00 UTC
- Amount: 25.75 ETH
- Transaction Hash: 0xabc123def4567890123456789012345678901234567890123456789012345678
- Destination: Unverified wallet

Risk Assessment:
- Risk Level: HIGH
- Pattern: Large transfer to unverified wallet
- Previous Flags: 2
- Account Age: 6 months

Action Taken:
- Account flagged for review
- Transaction blocked
- Compliance team notified
- Law enforcement notified

Reported By: Bank Compliance Officer
Timestamp: 2024-12-15 10:00:00 UTC
```

### Sample Image Metadata (Save as .txt)
```
SCREENSHOT EVIDENCE METADATA
=============================

Case ID: LEA-CASE-2024-002
Screenshot Date: December 15, 2024
Investigation Officer: Detective Jane Smith
Badge Number: LEA-12345

Wallet Analysis Screenshot:
- Wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
- Screenshot Time: 2024-12-15 15:30:00 UTC
- Source: Etherscan.io transaction history
- Screen Resolution: 1920x1080

Key Observations:
1. Rapid transfer sequence detected
2. Multiple exchange connections identified
3. Total volume: 150 ETH in 48 hours
4. Pattern matches known money laundering scheme

Related Cases:
- BANK-FRAUD-2024-001
- TX-LOG-2024-003

Status: Active Investigation
Next Steps: Cross-reference with exchange data
```

### Sample CSV Content
```
Case ID,Wallet Address,Transaction Hash,Amount,Date,Type,Destination
TX-LOG-2024-003,0x0000000000001ff3684f28c67538d4d072c22734,0xtx001,10.5 ETH,2024-12-14,Transfer,0xabc123
TX-LOG-2024-003,0x0000000000001ff3684f28c67538d4d072c22734,0xtx002,5.2 ETH,2024-12-14,Transfer,0xdef456
TX-LOG-2024-003,0x0000000000001ff3684f28c67538d4d072c22734,0xtx003,8.75 ETH,2024-12-14,Transfer,0x789abc
TX-LOG-2024-003,0x0000000000001ff3684f28c67538d4d072c22734,0xtx004,15.3 ETH,2024-12-14,Transfer,0x456def
```

---

## 🎬 Quick Demo Data (For Presentations)

### Demo Scenario: Multi-Agency Fraud Investigation

**Upload 1: Bank Reports Suspicion**
```
Case ID: DEMO-FRAUD-001
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Role: BANK
File: bank_statement.pdf
Type: pdf
```

**Upload 2: LEA Adds Investigation**
```
Case ID: DEMO-FRAUD-001
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Role: LEA
File: investigation_notes.png
Type: image
```

**Upload 3: Bank Adds Transaction Log**
```
Case ID: DEMO-FRAUD-001
Wallet: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Role: BANK
File: transaction_log.csv
Type: csv
```

**Then:**
1. Search by Case ID: `DEMO-FRAUD-001` → Shows all 3 files
2. Search by Wallet: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` → Shows all 3 files
3. Verify original file → Shows AUTHENTIC
4. Modify file → Verify again → Shows TAMPERED

---

## ✅ Checklist for Complete Demo

- [ ] Upload evidence as BANK
- [ ] Upload evidence as LEA (same case ID)
- [ ] Search by Case ID → See multiple files
- [ ] Search by Wallet → See all related evidence
- [ ] Verify original file → AUTHENTIC
- [ ] Modify file and verify → TAMPERED
- [ ] Check MongoDB Compass → See all records
- [ ] Verify chain of custody (who uploaded, when)

---

## 💡 Pro Tips

1. **For Quick Testing**: Create simple .txt files with any content
2. **For Realistic Demo**: Use PDF files (bank statements, reports)
3. **Case IDs**: Use consistent format like `BANK-YYYY-XXX` for easy searching
4. **File Names**: Make them descriptive (e.g., `fraud_report_BANK_001.pdf`)
5. **Testing Verification**: Always keep the original file unchanged for testing

---

**Happy Testing! 🚀**

