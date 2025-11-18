import React, { useState } from 'react';

const BankA_UI = ({ contract }) => {
  const [caseId, setCaseId] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const fromAccount = "Account-A-123"; // Static reporting account

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contract || !caseId || !toAccount || !amount) {
      alert("Please fill all fields and ensure contract is loaded.");
      return;
    }

    try {
      // Calls reportFraud on the contract
      const tx = await contract.reportFraud(
        caseId,
        fromAccount,
        toAccount,
        // Convert amount to a number/BigNumber if needed, but for MVP keep it as a string for ethers
        amount 
      );
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Fraud Reported!");
      alert(`Fraud Reported successfully! Case ID: ${caseId}`);

      // Clear the form
      setCaseId('');
      setToAccount('');
      setAmount('');
    } catch (error) {
      console.error("Error reporting fraud:", error);
      alert(`Failed to report fraud. See console for details. (Ensure you are using the 'bankAddress' signer)`);
    }
  };

  return (
    <div>
      <h2>Bank A (Report Fraud)</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Case ID (Unique):
          <input 
            type="text" 
            value={caseId} 
            onChange={(e) => setCaseId(e.target.value)} 
            required 
          />
        </label>
        <br />
        <label>
          Receiving Account (To):
          <input 
            type="text" 
            value={toAccount} 
            onChange={(e) => setToAccount(e.target.value)} 
            required 
          />
        </label>
        <br />
        <label>
          Amount (uint):
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            min="1"
          />
        </label>
        <br />
        <p>From Account: {fromAccount}</p>
        <button type="submit">Report Fraud</button>
      </form>
    </div>
  );
};

export default BankA_UI;

