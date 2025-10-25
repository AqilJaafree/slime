// Direct ethers.js script with .env support
// Run with: npx tsx scripts/set-peers-env.ts
// Or: node --loader ts-node/esm scripts/set-peers-env.ts

import { ethers } from "ethers";
import dotenv from "dotenv";

// Load .env file from contract directory
dotenv.config();

// ============ CONFIGURATION FROM .ENV ============
const ALCHEMY_SEPOLIA_URL = process.env.ALCHEMY_SEPOLIA_URL || 
                            process.env.SEPOLIA_RPC_URL ||
                            "https://ethereum-sepolia-rpc.publicnode.com";

const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

const ADAPTER_ADDRESS = process.env.ADAPTER_ADDRESS || 
                       "0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E";

const OFT_ADDRESS = process.env.OFT_ADDRESS || 
                   "0x6a87032589b837935b1a393dc905c84e908c6974";

const HEDERA_EID = parseInt(process.env.HEDERA_EID || "40285");
// =======================================

const ADAPTER_ABI = [
  "function setPeer(uint32 _eid, bytes32 _peer) external",
  "function peers(uint32 _eid) external view returns (bytes32)",
];

async function main() {
  console.log("📋 Configuration:");
  console.log("   RPC URL:", ALCHEMY_SEPOLIA_URL);
  console.log("   Adapter:", ADAPTER_ADDRESS);
  console.log("   OFT:", OFT_ADDRESS);
  console.log("   Hedera EID:", HEDERA_EID);
  console.log("");

  // Validate required env vars
  if (!PRIVATE_KEY) {
    throw new Error(
      "❌ SEPOLIA_PRIVATE_KEY not found in .env file!\n" +
      "   Add it to your .env file:\n" +
      "   SEPOLIA_PRIVATE_KEY=your_private_key_here"
    );
  }

  console.log("🔗 Connecting to Sepolia...");
  const provider = new ethers.JsonRpcProvider(ALCHEMY_SEPOLIA_URL);

  // Test connection
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log("✅ Connected! Current block:", blockNumber);
  } catch (error: any) {
    throw new Error(
      `❌ Failed to connect to RPC:\n   ${error.message}\n` +
      `   Check your ALCHEMY_SEPOLIA_URL in .env`
    );
  }

  // Create wallet
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("👛 Using wallet:", wallet.address);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error(
      "❌ No ETH balance! Get Sepolia ETH from:\n" +
      "   • https://sepoliafaucet.com\n" +
      "   • https://www.alchemy.com/faucets/ethereum-sepolia"
    );
  }

  // Connect to adapter
  const adapter = new ethers.Contract(ADAPTER_ADDRESS, ADAPTER_ABI, wallet);

  // Check if peer already set
  console.log("\n🔍 Checking if peer is already set...");
  const existingPeer = await adapter.peers(HEDERA_EID);
  const targetPeer = ethers.zeroPadValue(OFT_ADDRESS, 32);

  if (existingPeer.toLowerCase() === targetPeer.toLowerCase()) {
    console.log("✅ Peer already set correctly!");
    console.log("   No transaction needed.");
    return;
  }

  console.log("📡 Setting peer on Sepolia...");

  // Estimate gas
  let gasEstimate: bigint;
  try {
    gasEstimate = await adapter.setPeer.estimateGas(HEDERA_EID, targetPeer);
    console.log("⛽ Estimated gas:", gasEstimate.toString());
  } catch (error) {
    console.warn("⚠️  Gas estimation failed, using default");
    gasEstimate = 100000n;
  }

  // Send transaction with 20% buffer
  const tx = await adapter.setPeer(HEDERA_EID, targetPeer, {
    gasLimit: (gasEstimate * 120n) / 100n,
  });

  console.log("📤 Transaction sent:", tx.hash);
  console.log("   Explorer:", `https://sepolia.etherscan.io/tx/${tx.hash}`);
  console.log("⏳ Waiting for confirmation...");

  const receipt = await tx.wait();

  console.log("\n✅ Transaction confirmed!");
  console.log("   Block:", receipt.blockNumber);
  console.log("   Gas used:", receipt.gasUsed.toString());
  console.log("   Status:", receipt.status === 1 ? "Success" : "Failed");

  // Verify
  console.log("\n🔍 Verifying peer is set...");
  const peer = await adapter.peers(HEDERA_EID);

  if (peer.toLowerCase() === targetPeer.toLowerCase()) {
    console.log("✅ Peer verified successfully!");
    console.log("   Peer:", peer);
  } else {
    console.log("⚠️  Peer mismatch!");
    console.log("   Expected:", targetPeer);
    console.log("   Got:", peer);
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Sepolia side complete!");
  console.log("=".repeat(50));
  console.log("\n📋 Next Step: Set peer on Hedera side");
  console.log("   Run: npx tsx scripts/set-peers-hedera-env.ts");
}

main().catch((error: Error) => {
  console.error("\n❌ Error:", error.message);
  if (error.stack) {
    console.error("\nStack trace:", error.stack);
  }
  process.exit(1);
});