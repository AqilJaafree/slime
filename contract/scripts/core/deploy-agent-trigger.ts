import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 DEPLOYING AGENT TRIGGER CONTRACT");
  console.log("=".repeat(60) + "\n");

  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Configuration:");
  console.log(`   Network: Hedera Testnet`);
  console.log(`   Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`   Balance: ${ethers.formatEther(balance)} HBAR\n`);

  // ProposalFutarchy contract address
  const FUTARCHY_ADDRESS = process.env.FUTARCHY_ADDRESS || "0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6";
  
  console.log(`   ProposalFutarchy: ${FUTARCHY_ADDRESS}\n`);

  // Deploy AgentTrigger
  console.log("📦 Deploying AgentTrigger...");
  const AgentTrigger = await ethers.getContractFactory("AgentTrigger");
  const agentTrigger = await AgentTrigger.deploy(FUTARCHY_ADDRESS);

  console.log("⏳ Waiting for deployment...");
  await agentTrigger.waitForDeployment();
  
  const agentTriggerAddress = await agentTrigger.getAddress();

  console.log("✅ AgentTrigger deployed!\n");
  
  console.log("=".repeat(60));
  console.log("📋 CONTRACT ADDRESSES");
  console.log("=".repeat(60));
  console.log(`AgentTrigger: ${agentTriggerAddress}`);
  console.log(`ProposalFutarchy: ${FUTARCHY_ADDRESS}\n`);

  console.log("=".repeat(60));
  console.log("🔍 VERIFICATION LINKS");
  console.log("=".repeat(60));
  console.log(`HashScan: https://hashscan.io/testnet/contract/${agentTriggerAddress}`);
  console.log(`\n💡 Save this address for your .env file:`);
  console.log(`AGENT_TRIGGER_ADDRESS=${agentTriggerAddress}\n`);

  console.log("=".repeat(60));
  console.log("✅ DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Next Steps:");
  console.log("1. Add AGENT_TRIGGER_ADDRESS to your .env file");
  console.log("2. Update ProposalFutarchy to connect AgentTrigger:");
  console.log("   npx hardhat run scripts/core/set-agent-trigger.ts --network hedera");
  console.log("3. Register your backend wallet as agent:");
  console.log("   npx hardhat run scripts/core/register-agent.ts --network hedera");
  console.log("4. Verify contract on HashScan:");
  console.log(`   npx hardhat run scripts/core/verify-agent-trigger.ts --network hedera\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });