import React, { useState, useEffect } from 'react';

const LeaDashboard = ({ contract }) => {
  const [alerts, setAlerts] = useState([]); // State to store reported cases

  // Function to call the contract's freeze function
  const handleFreeze = async (caseId) => {
    try {
      console.log(`Attempting to freeze funds for Case ID: ${caseId}`);
      // Calls the triggerProvisionalHold function on the contract
      const tx = await contract.triggerProvisionalHold(caseId);
      await tx.wait(); // Wait for the transaction to be mined
      console.log(`Freeze transaction submitted for Case ID: ${caseId}`);
      // Update UI to reflect 'Pending' or remove item, based on preference, 
      // but for this MVP we rely on the Bank B to confirm 'FROZEN'.
    } catch (error) {
      console.error("Error triggering provisional hold:", error);
    }
  };

  useEffect(() => {
    // Only set up listener if the contract object is available
    if (contract) {
      // Set up listener for the 'FraudReported' event
      const fraudReportedListener = (caseId, from, to, amount) => {
        const newAlert = {
          id: caseId,
          from: from,
          to: to,
          // Convert amount (BigNumber) to string for display
          amount: amount.toString(), 
          status: 'Reported' // Not explicitly in contract, but useful for display
        };
        // Add the new alert to the state array
        setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
        console.log(`New Fraud Reported: Case ${caseId}`);
      };

      contract.on("FraudReported", fraudReportedListener);

      // Cleanup function to remove the listener when the component unmounts
      return () => {
        contract.off("FraudReported", fraudReportedListener);
      };
    }
  }, [contract]); // Rerun effect if the contract instance changes

  return (
    <div>
      <h2>LEA Dashboard (Real-Time)</h2>
      {alerts.length === 0 ? (
        <p>No new fraud alerts.</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id}>
              <p><strong>Case ID:</strong> {alert.id}</p>
              <p><strong>From:</strong> {alert.from}</p>
              <p><strong>To:</strong> {alert.to}</p>
              <p><strong>Amount:</strong> {alert.amount}</p>
              <button onClick={() => handleFreeze(alert.id)}>Freeze Funds</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeaDashboard;

