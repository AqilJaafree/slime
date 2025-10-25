import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("💰 CHECKING PYUSD OFT BALANCE ON HEDERA");
  console.log("=".repeat(50) + "\n");

  const OFT_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";
  const YOUR_ADDRESS = process.env.RECEIVER_ADDRESS || "0xd6499417BbC291304fc16f6849A1717D45569494";

  console.log("📋 Configuration:");
  console.log(`   PYUSD OFT Contract: ${OFT_ADDRESS}`);
  console.log(`   Your Address: ${YOUR_ADDRESS}\n`);

  // Get OFT contract
  const oft = await ethers.getContractAt(
    [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)"
    ],
    OFT_ADDRESS
  );

  console.log("🔍 Fetching token info...");
  try {
    const name = await oft.name();
    const symbol = await oft.symbol();
    const decimals = await oft.decimals();
    const totalSupply = await oft.totalSupply();

    console.log(`   Token Name: ${name}`);
    console.log(`   Token Symbol: ${symbol}`);
    console.log(`   Decimals: ${decimals}`);
    console.log(`   Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}\n`);
  } catch (error: any) {
    console.log(`   ⚠️  Could not fetch token info: ${error.message}\n`);
  }

  console.log("💰 Checking your balance...");
  try {
    const balance = await oft.balanceOf(YOUR_ADDRESS);
    const decimals = await oft.decimals();
    const symbol = await oft.symbol();

    console.log(`\n${"=".repeat(50)}`);
    console.log(`🎉 YOUR PYUSD OFT BALANCE: ${ethers.formatUnits(balance, decimals)} ${symbol}`);
    console.log(`${"=".repeat(50)}\n`);

    if (balance > 0n) {
      console.log("✅ SUCCESS! You have received PYUSD OFT on Hedera!");
      console.log("\n📋 What happened:");
      console.log("   ✅ Your bridge transaction was delivered");
      console.log("   ✅ PYUSD OFT tokens were minted to your address");
      console.log("   ✅ The LayerZero executor completed the delivery\n");
      
      console.log("🔍 View your tokens:");
      console.log(`   Account: https://hashscan.io/testnet/account/${YOUR_ADDRESS}`);
      console.log(`   Token Contract: https://hashscan.io/testnet/contract/${OFT_ADDRESS}\n`);
      
      console.log("💡 Note: These are PYUSD OFT tokens on Hedera, not native PYUSD.");
      console.log("   The original PYUSD is locked in the adapter on Sepolia.\n");
    } else {
      console.log("❌ Balance is 0. The tokens haven't arrived yet.");
      console.log("\n💡 Possible reasons:");
      console.log("   1. Executor is still processing (wait longer)");
      console.log("   2. Message is blocked (check LayerZero Scan)");
      console.log("   3. Configuration issue\n");
      
      console.log("🔍 Check LayerZero Scan:");
      console.log("   https://testnet.layerzeroscan.com/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788\n");
    }
  } catch (error: any) {
    console.error(`❌ Error checking balance: ${error.message}\n`);
  }

  // Check native HBAR balance too
  console.log("💰 Your HBAR balance:");
  const hbarBalance = await ethers.provider.getBalance(YOUR_ADDRESS);
  console.log(`   ${ethers.formatEther(hbarBalance)} HBAR\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });