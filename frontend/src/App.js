import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Import Components
import LeaDashboard from './LeaDashboard';
import BankA_UI from './BankA_UI';
import BankB_UI from './BankB_UI';

// Import ABI (JSON file is created by Hardhat compile)
import FraudLedgerABI from './FraudLedger.json'; 

// IMPORTANT: Replace this with the address printed by Hardhat's deploy script!
const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; 

function App() {
  // State to hold the contract instance
  const [contract, setContract] = useState(null);

  useEffect(() => {
    // Function to initialize the blockchain connection
    const initEthers = async () => {
      try {
        // 1. Create a provider for the local Hardhat node
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        
        // 2. Get the signer (the first account from Hardhat's node)
        // This signer will be used for state-changing transactions (reportFraud, triggerProvisionalHold).
        const signer = provider.getSigner(); 

        // 3. Create the contract instance
        const fraudLedgerContract = new ethers.Contract(
          contractAddress,
          FraudLedgerABI.abi, // Use the ABI data
          signer // Pass the signer for transactions
        );

        // 4. Set the contract instance in state
        setContract(fraudLedgerContract);
        console.log("Contract successfully connected and set in state.");

      } catch (error) {
        console.error("Error connecting to blockchain:", error);
        // Show user an error in a production app
      }
    };

    initEthers();
  }, []); // Empty dependency array ensures it runs once on load

  // Simple style for a 3-column layout
  const appStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
    padding: '20px',
  };

  if (!contract) {
    // Show loading message while connecting
    return <div style={{ padding: '20px' }}><h1>Connecting to blockchain...</h1></div>;
  }

  return (
    <div style={appStyle}>
      {/* 1. Bank A (Reporting) UI */}
      <BankA_UI contract={contract} /> 

      {/* 2. LEA Dashboard (Listening & Freezing) UI */}
      <LeaDashboard contract={contract} /> 

      {/* 3. Bank B (Receiving/Listening) UI */}
      <BankB_UI contract={contract} /> 
    </div>
  );
}

export default App;

