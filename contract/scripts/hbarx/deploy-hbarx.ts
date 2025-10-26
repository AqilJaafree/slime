import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🚀 DEPLOYING HBARX - LIQUID STAKED HBAR");
  console.log("=".repeat(60) + "\n");

  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Configuration:");
  console.log(`   Network: Hedera Testnet`);
  console.log(`   Deployer: ${deployer.address}`);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`   Balance: ${ethers.formatEther(balance)} HBAR\n`);

  // Deploy HBARX
  console.log("📦 Deploying HBARX...");
  const HBARX = await ethers.getContractFactory("HBARX");
  const hbarx = await HBARX.deploy();

  console.log("⏳ Waiting for deployment...");
  await hbarx.waitForDeployment();
  
  const hbarxAddress = await hbarx.getAddress();

  console.log("✅ HBARX deployed!\n");
  
  // Get contract instance with proper typing
  const hbarxContract = await ethers.getContractAt("HBARX", hbarxAddress);
  
  // Get token info
  const name = await hbarxContract.name();
  const symbol = await hbarxContract.symbol();
  const decimals = await hbarxContract.decimals();
  const exchangeRate = await hbarxContract.exchangeRate();
  
  console.log("📋 Token Information:");
  console.log(`   Name: ${name}`);
  console.log(`   Symbol: ${symbol}`);
  console.log(`   Decimals: ${decimals}`);
  console.log(`   Initial Exchange Rate: ${ethers.formatEther(exchangeRate)} HBAR per HBARX\n`);
  
  console.log("=".repeat(60));
  console.log("📋 CONTRACT ADDRESS");
  console.log("=".repeat(60));
  console.log(`HBARX: ${hbarxAddress}\n`);

  console.log("=".repeat(60));
  console.log("🔍 VERIFICATION");
  console.log("=".repeat(60));
  console.log(`HashScan: https://hashscan.io/testnet/contract/${hbarxAddress}`);
  console.log(`\n💡 Save this address for your .env file:`);
  console.log(`HBARX_ADDRESS=${hbarxAddress}\n`);
  
  console.log("💡 Verify command:");
  console.log(`npx hardhat hashscan-verify ${hbarxAddress} --contract contracts/HBARX.sol:HBARX --network testnet\n`);

  console.log("=".repeat(60));
  console.log("✅ DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Next Steps:");
  console.log("1. Add HBARX_ADDRESS to your .env file");
  console.log("2. Verify contract");
  console.log("3. Test staking:");
  console.log("   npx hardhat run scripts/hbarx/test-stake.ts --network testnet\n");
  
  console.log("=".repeat(60));
  console.log("📊 COMPLETE FLOW");
  console.log("=".repeat(60));
  console.log("1. Market resolves YES");
  console.log("2. Vincent gets PYUSD from Futarchy");
  console.log("3. Vincent swaps PYUSD → HBAR");
  console.log("4. Vincent stakes HBAR → HBARX");
  console.log("5. HBARX earns ~6.5% APR (Hedera staking)");
  console.log("6. After 30 days: Vincent adds rewards");
  console.log("7. Vincent unstakes HBARX → HBAR");
  console.log("8. Vincent swaps HBAR → PYUSD");
  console.log("9. Vincent reports yield to AgentTrigger");
  console.log("10. Users claim PYUSD + yield!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });