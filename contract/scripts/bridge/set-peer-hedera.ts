import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🔗 SETTING PEER ON HEDERA OFT");
  console.log("=".repeat(50) + "\n");

  const OFT_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";
  const ADAPTER_ADDRESS = process.env.ADAPTER_ADDRESS || "0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E";
  const SEPOLIA_EID = parseInt(process.env.SEPOLIA_EID || "40161");

  const [signer] = await ethers.getSigners();
  
  console.log("📋 Configuration:");
  console.log(`   OFT (Hedera): ${OFT_ADDRESS}`);
  console.log(`   Adapter (Sepolia): ${ADAPTER_ADDRESS}`);
  console.log(`   Sepolia EID: ${SEPOLIA_EID}\n`);

  console.log("🔗 Connecting to Hedera...");
  const blockNumber = await ethers.provider.getBlockNumber();
  console.log(`✅ Connected! Current block: ${blockNumber}`);
  console.log(`👛 Using wallet: ${signer.address}`);
  const balance = await ethers.provider.getBalance(signer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} HBAR\n`);

  // Get OFT contract
  const oft = await ethers.getContractAt("PYUSDOFT", OFT_ADDRESS);

  // Check current peer
  console.log("🔍 Checking if peer is already set...");
  const currentPeer = await oft.peers(SEPOLIA_EID);
  const expectedPeer = ethers.zeroPadValue(ADAPTER_ADDRESS.toLowerCase(), 32);
  
  console.log(`   Current peer: ${currentPeer}`);
  console.log(`   Expected peer: ${expectedPeer}\n`);

  if (currentPeer.toLowerCase() === expectedPeer.toLowerCase()) {
    console.log("✅ Peer is already set correctly!");
    console.log("\n" + "=".repeat(50));
    console.log("🎉 Hedera side already configured!");
    console.log("=".repeat(50));
    console.log("\n📋 You're ready to bridge!");
    console.log("   Run: npx hardhat run scripts/bridge-pyusd.ts --network sepolia\n");
    return;
  }

  // Set peer
  console.log("📡 Setting peer on Hedera OFT...");
  const estimatedGas = await oft.setPeer.estimateGas(SEPOLIA_EID, expectedPeer);
  console.log(`⛽ Estimated gas: ${estimatedGas}`);

  const tx = await oft.setPeer(SEPOLIA_EID, expectedPeer);
  console.log(`📤 Transaction sent: ${tx.hash}`);
  console.log(`   Explorer: https://hashscan.io/testnet/transaction/${tx.hash}`);
  console.log("⏳ Waiting for confirmation...\n");

  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed!");

  // Verify peer is set
  console.log("🔍 Verifying peer is set...");
  const newPeer = await oft.peers(SEPOLIA_EID);
  if (newPeer.toLowerCase() === expectedPeer.toLowerCase()) {
    console.log("✅ Peer verified successfully!");
    console.log(`   Peer: ${newPeer}\n`);
  } else {
    console.log("❌ Peer verification failed!\n");
    return;
  }

  console.log("=".repeat(50));
  console.log("🎉 BOTH SIDES NOW CONFIGURED!");
  console.log("=".repeat(50));
  console.log("\n📋 Pathway Setup:");
  console.log("   Sepolia Adapter ←→ Hedera OFT");
  console.log("   Both peers are set correctly!");
  console.log("\n📋 Next Step: Bridge your PYUSD");
  console.log("   Run: npx hardhat run scripts/bridge-pyusd.ts --network sepolia\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });