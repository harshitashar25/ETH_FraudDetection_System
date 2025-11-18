import React, { useState, useEffect } from 'react';

const BankB_UI = ({ contract }) => {
  const [statusMessage, setStatusMessage] = useState("All Clear");

  useEffect(() => {
    if (contract) {
      // Listener for the 'HoldExecuted' event
      const holdExecutedListener = (caseId, toAccount) => {
        // Update the status message upon receiving the event
        const message = `FUNDS for account ${toAccount} (Case: ${caseId}). FROZEN`;
        setStatusMessage(message);
        console.log(`Hold Executed: Case ${caseId}. Account: ${toAccount}`);
      };

      contract.on("HoldExecuted", holdExecutedListener);

      // Cleanup function
      return () => {
        contract.off("HoldExecuted", holdExecutedListener);
      };
    }
  }, [contract]);

  return (
    <div>
      <h2>Bank B (Receiving Bank)</h2>
      <p style={{ 
        color: statusMessage.includes("FROZEN") ? 'red' : 'green', 
        fontWeight: 'bold' 
      }}>
        {statusMessage} {/* Display the current status message */}
      </p>
    </div>
  );
};

export default BankB_UI;

