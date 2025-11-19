/**
 * Test script for Evidence Upload Endpoint
 * Run this to verify the endpoint is working after restarting the server
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:5000';

async function testEvidenceUpload() {
  console.log('🧪 Testing Evidence Upload Endpoint\n');
  console.log('='.repeat(50));

  // Test 1: GET endpoint
  console.log('\n1️⃣ Testing GET /api/evidence/upload');
  try {
    const getResponse = await axios.get(`${API_BASE_URL}/api/evidence/upload`);
    console.log('✅ GET endpoint works!');
    console.log('   Response:', getResponse.data);
  } catch (error) {
    console.log('❌ GET endpoint failed!');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else if (error.request) {
      console.log('   ⚠️  Cannot connect to server. Is the backend running?');
      console.log('   Run: cd backend && npm start');
    } else {
      console.log('   Error:', error.message);
    }
    return;
  }

  // Test 2: Create a test file
  console.log('\n2️⃣ Creating test file...');
  const testFileContent = 'This is a test evidence file for case TEST-001';
  const testFilePath = path.join(__dirname, 'test-evidence.txt');
  
  try {
    fs.writeFileSync(testFilePath, testFileContent);
    console.log('✅ Test file created:', testFilePath);
  } catch (error) {
    console.log('❌ Failed to create test file:', error.message);
    return;
  }

  // Test 3: POST endpoint with valid data
  console.log('\n3️⃣ Testing POST /api/evidence/upload');
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    formData.append('txId', 'TEST-001');
    formData.append('walletAddress', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
    formData.append('uploaderRole', 'BANK');
    formData.append('evidenceType', 'log');

    const postResponse = await axios.post(
      `${API_BASE_URL}/api/evidence/upload`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000
      }
    );

    console.log('✅ POST endpoint works!');
    console.log('   Response:', JSON.stringify(postResponse.data, null, 2));
  } catch (error) {
    console.log('❌ POST endpoint failed!');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('   ⚠️  No response received. Check server logs.');
    } else {
      console.log('   Error:', error.message);
    }
  } finally {
    // Clean up test file
    try {
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
        console.log('\n🧹 Test file cleaned up');
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Test complete!');
  console.log('\n💡 If tests passed, your endpoint is working correctly!');
  console.log('   You can now use the frontend to upload evidence.');
}

// Run tests
testEvidenceUpload().catch(console.error);

