const hre = require("hardhat");

async function main() {
  console.log("Deploying FraudRegistry contract...");

  // Get the contract factory
  const FraudRegistry = await hre.ethers.getContractFactory("FraudRegistry");
  
  // Deploy the contract
  const fraudRegistry = await FraudRegistry.deploy();

  // Wait for deployment
  await fraudRegistry.waitForDeployment();

  const address = await fraudRegistry.getAddress();
  
  console.log("\n✅ FraudRegistry contract deployed!");
  console.log(`📍 Address: ${address}`);
  console.log(`\n⚠️  IMPORTANT: Add this to backend/.env:`);
  console.log(`   FRAUD_REGISTRY_ADDRESS=${address}\n`);
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

