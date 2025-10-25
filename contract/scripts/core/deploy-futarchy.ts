import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 DEPLOYING PROPOSAL FUTARCHY CONTRACT");
  console.log("=".repeat(60) + "\n");

  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Configuration:");
  console.log(`   Network: Hedera Testnet`);
  console.log(`   Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`   Balance: ${ethers.formatEther(balance)} HBAR\n`);

  // PYUSD OFT contract address on Hedera
  const PYUSD_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";
  
  console.log(`   PYUSD Token: ${PYUSD_ADDRESS}\n`);

  // Deploy ProposalFutarchy
  console.log("📦 Deploying ProposalFutarchy...");
  const ProposalFutarchy = await ethers.getContractFactory("ProposalFutarchy");
  const futarchy = await ProposalFutarchy.deploy(PYUSD_ADDRESS);

  console.log("⏳ Waiting for deployment...");
  await futarchy.waitForDeployment();
  
  const futarchyAddress = await futarchy.getAddress();

  console.log("✅ ProposalFutarchy deployed!\n");
  
  console.log("=".repeat(60));
  console.log("📋 CONTRACT ADDRESSES");
  console.log("=".repeat(60));
  console.log(`ProposalFutarchy: ${futarchyAddress}`);
  console.log(`PYUSD Token: ${PYUSD_ADDRESS}\n`);

  console.log("=".repeat(60));
  console.log("🔍 VERIFICATION LINKS");
  console.log("=".repeat(60));
  console.log(`HashScan: https://hashscan.io/testnet/contract/${futarchyAddress}`);
  console.log(`\n💡 Save this address for your .env file:`);
  console.log(`FUTARCHY_ADDRESS=${futarchyAddress}\n`);

  console.log("=".repeat(60));
  console.log("✅ DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Next Steps:");
  console.log("1. Add FUTARCHY_ADDRESS to your .env file");
  console.log("2. Test creating a proposal:");
  console.log("   npx hardhat run scripts/create-proposal.ts --network hedera");
  console.log("3. Users can now bet and fund strategies!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });