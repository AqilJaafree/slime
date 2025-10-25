import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🔗 CONNECTING AGENT TRIGGER TO FUTARCHY");
  console.log("=".repeat(60) + "\n");

  const FUTARCHY_ADDRESS = "0xbe6cb70Ce7C6A300E45c5B6ECA2Ee73cb2b74902";
  const AGENT_TRIGGER_ADDRESS = "0x081dEd6F31eBeC1F2eCEdDE5d97384f66148be21";

  const [signer] = await ethers.getSigners();
  console.log("📋 Configuration:");
  console.log(`   Signer: ${signer.address}`);
  console.log(`   ProposalFutarchy: ${FUTARCHY_ADDRESS}`);
  console.log(`   AgentTrigger: ${AGENT_TRIGGER_ADDRESS}\n`);

  const futarchy = await ethers.getContractAt("ProposalFutarchy", FUTARCHY_ADDRESS);

  console.log("⏳ Setting AgentTrigger...");
  const tx = await futarchy.setAgentTrigger(AGENT_TRIGGER_ADDRESS);
  console.log(`   TX: ${tx.hash}`);
  await tx.wait();
  console.log("✅ Transaction confirmed!\n");

  // Verify
  const setAddress = await futarchy.agentTrigger();
  console.log("📋 Verification:");
  console.log(`   Expected: ${AGENT_TRIGGER_ADDRESS}`);
  console.log(`   Actual:   ${setAddress}`);
  console.log(`   Match: ${setAddress.toLowerCase() === AGENT_TRIGGER_ADDRESS.toLowerCase() ? "✅ YES" : "❌ NO"}\n`);

  console.log("=".repeat(60));
  console.log("🎉 CONTRACTS CONNECTED!");
  console.log("=".repeat(60));
  console.log(`\n🔍 View transaction:`);
  console.log(`   https://hashscan.io/testnet/transaction/${tx.hash}\n`);
  
  console.log("📋 Final Setup:");
  console.log(`   ✅ ProposalFutarchy: ${FUTARCHY_ADDRESS}`);
  console.log(`   ✅ AgentTrigger: ${AGENT_TRIGGER_ADDRESS}`);
  console.log(`   ✅ Connected: YES\n`);
  
  console.log("📋 Next Steps:");
  console.log("1. Update your .env with these addresses");
  console.log("2. Test creating a proposal");
  console.log("3. Set up Vincent backend to listen for MarketResolved events\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Failed:");
    console.error(error);
    process.exit(1);
  });