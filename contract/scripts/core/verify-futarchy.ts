import hre from "hardhat";
import { verifyContract } from "@nomicfoundation/hardhat-verify/verify";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🔍 VERIFYING PROPOSAL FUTARCHY CONTRACT");
  console.log("=".repeat(60) + "\n");

  const FUTARCHY_ADDRESS = process.env.FUTARCHY_ADDRESS;
  const PYUSD_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";

  if (!FUTARCHY_ADDRESS) {
    console.error("❌ FUTARCHY_ADDRESS not found in .env file!");
    console.log("\nAdd it to your .env file:");
    console.log("FUTARCHY_ADDRESS=0xYourContractAddress\n");
    process.exit(1);
  }

  console.log("📋 Verification Details:");
  console.log(`   Contract Address: ${FUTARCHY_ADDRESS}`);
  console.log(`   Constructor Arg (PYUSD): ${PYUSD_ADDRESS}`);
  console.log(`   Network: Hedera Testnet\n`);

  try {
    console.log("⏳ Submitting to HashScan...");
    
    await verifyContract(
      {
        address: FUTARCHY_ADDRESS,
        constructorArgs: [PYUSD_ADDRESS],
        provider: "etherscan",
      },
      hre
    );

    console.log("\n✅ Contract verified successfully!\n");
    console.log("=".repeat(60));
    console.log("🎉 SUCCESS!");
    console.log("=".repeat(60));
    console.log(`\n🔍 View verified contract:`);
    console.log(`   https://hashscan.io/testnet/contract/${FUTARCHY_ADDRESS}\n`);

  } catch (error: any) {
    if (error.message.includes("Already Verified") || error.message.includes("already verified")) {
      console.log("\n✅ Contract is already verified!\n");
      console.log(`🔍 View contract:`);
      console.log(`   https://hashscan.io/testnet/contract/${FUTARCHY_ADDRESS}\n`);
    } else if (error.message.includes("does not have bytecode")) {
      console.error("\n❌ Contract not found at this address!");
      console.log("   Make sure the contract is deployed and the address is correct.\n");
    } else {
      console.error("\n❌ Verification failed!");
      console.error(`   Error: ${error.message}\n`);
      
      console.log("💡 Troubleshooting:");
      console.log("   1. Make sure contract is deployed");
      console.log("   2. Wait a few minutes after deployment");
      console.log("   3. Check that PYUSD address is correct");
      console.log("   4. Try CLI verification:\n");
      console.log(`      npx hardhat verify --network hedera ${FUTARCHY_ADDRESS} ${PYUSD_ADDRESS}\n`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });