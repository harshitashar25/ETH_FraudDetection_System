/**
 * Quick test script to verify Moralis API connection
 * Run: node test-moralis.js
 */

require('dotenv').config();
const MoralisService = require('./services/moralisService');

async function testMoralis() {
  console.log('🧪 Testing Moralis API Connection...\n');
  
  const apiKey = process.env.MORALIS_API_KEY;
  
  if (!apiKey || apiKey === 'your_moralis_api_key_here') {
    console.error('❌ ERROR: Moralis API key not configured!');
    console.log('\nPlease:');
    console.log('1. Get a free API key from https://moralis.io/');
    console.log('2. Add it to backend/.env file:');
    console.log('   MORALIS_API_KEY=your_actual_key_here\n');
    process.exit(1);
  }
  
  console.log('✅ API Key found (length:', apiKey.length, 'characters)');
  console.log('   First 10 chars:', apiKey.substring(0, 10) + '...\n');
  
  const moralisService = new MoralisService();
  
  // Test with a known active wallet - use Vitalik's well-known address
  const testAddress = '0x0000000000001ff3684f28c67538d4d072c22734'; // Vitalik Buterin
  const chain = 'eth';
  
  console.log('📡 Testing API calls with address:', testAddress);
  console.log('   Chain: Ethereum\n');
  
  try {
    console.log('1. Testing wallet balance...');
    const balance = await moralisService.getWalletBalance(testAddress, chain);
    console.log('   ✅ Balance:', balance.balance || '0');
    console.log('   Balance (ETH):', (parseInt(balance.balance || '0') / 1e18).toFixed(6), 'ETH\n');
    
    console.log('2. Testing native transactions...');
    const txs = await moralisService.getNativeTransactions(testAddress, chain, 5);
    console.log('   ✅ Transactions found:', txs.result?.length || 0);
    if (txs.result && txs.result.length > 0) {
      console.log('   Latest tx hash:', txs.result[0].hash);
      console.log('   Latest tx value:', txs.result[0].value, 'wei\n');
    } else {
      console.log('   ⚠️  No transactions found\n');
    }
    
    console.log('3. Testing ERC20 transfers...');
    const erc20 = await moralisService.getERC20Transfers(testAddress, chain, 5);
    console.log('   ✅ ERC20 transfers found:', erc20.result?.length || 0);
    if (erc20.result && erc20.result.length > 0) {
      console.log('   Latest transfer token:', erc20.result[0].token_symbol);
      console.log('   Latest transfer value:', erc20.result[0].value, '\n');
    } else {
      console.log('   ⚠️  No ERC20 transfers found\n');
    }
    
    console.log('✅ All tests passed! Moralis API is working correctly.\n');
    console.log('If you see empty results, the wallet might not have activity.');
    console.log('Try a different wallet address that you know has transactions.\n');
    
  } catch (error) {
    console.error('\n❌ ERROR during API test:');
    console.error('   Message:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n⚠️  Authentication error - Your API key might be invalid!');
      } else if (error.response.status === 403) {
        console.error('\n⚠️  Forbidden - Check your API key permissions!');
      } else if (error.response.status === 429) {
        console.error('\n⚠️  Rate limit exceeded - Wait a few seconds and try again!');
      }
    }
    
    process.exit(1);
  }
}

testMoralis();

