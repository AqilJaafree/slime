import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("📋 HEDERA CONTRACT VERIFICATION GUIDE");
  console.log("=".repeat(60) + "\n");

  const OFT_ADDRESS = "0x6a87032589b837935b1a393dc905c84e908c6974";
  const contractName = "PYUSDOFT";

  console.log("📦 Contract Information:");
  console.log(`   Address: ${OFT_ADDRESS}`);
  console.log(`   Name: ${contractName}`);
  console.log(`   Network: Hedera Testnet (Chain ID: 296)\n`);

  // Find the build-info JSON file
  const buildInfoDir = path.join(process.cwd(), "artifacts", "build-info");
  
  if (!fs.existsSync(buildInfoDir)) {
    console.error("❌ Build info directory not found!");
    console.log("   Run: npx hardhat compile\n");
    return;
  }

  const buildInfoFiles = fs.readdirSync(buildInfoDir).filter(f => f.endsWith(".json"));
  
  if (buildInfoFiles.length === 0) {
    console.error("❌ No build-info files found!");
    console.log("   Run: npx hardhat clean && npx hardhat compile\n");
    return;
  }

  const buildInfoFile = buildInfoFiles[buildInfoFiles.length - 1];
  const buildInfoPath = path.join(buildInfoDir, buildInfoFile);

  console.log("✅ Found verification files:\n");
  console.log(`📄 Build Info File:`);
  console.log(`   ${buildInfoPath}\n`);

  console.log("=".repeat(60));
  console.log("🔧 VERIFICATION STEPS");
  console.log("=".repeat(60) + "\n");

  console.log("1️⃣ Go to HashScan:");
  console.log(`   https://hashscan.io/testnet/contract/${OFT_ADDRESS}\n`);

  console.log("2️⃣ Click on 'Contract' tab, then click 'Verify'");
  console.log("   (or go directly to the verify page)\n");

  console.log("3️⃣ Upload these files:");
  console.log(`   ✅ Build Info: ${buildInfoPath}`);
  console.log(`   ✅ Source File: contracts/PYUSDOFT.sol\n`);

  console.log("4️⃣ For Hardhat compilation:");
  console.log("   - Compiler: Hardhat");
  console.log("   - Just upload the build-info JSON file");
  console.log("   - HashScan will extract everything automatically\n");

  console.log("=".repeat(60));
  console.log("📋 CONSTRUCTOR ARGUMENTS");
  console.log("=".repeat(60) + "\n");

  console.log("If asked for constructor arguments:");
  console.log(`   Name: "PayPal USD"`);
  console.log(`   Symbol: "PYUSD"`);
  console.log(`   Endpoint: 0xbD672D1562Dd32C23B563C989d8140122483631d`);
  console.log(`   Owner: 0xd6499417BbC291304fc16f6849A1717D45569494\n`);

  console.log("=".repeat(60));
  console.log("✨ DONE!");
  console.log("=".repeat(60));
  console.log("\nAfter verification, your contract source code will be");
  console.log("publicly visible on HashScan! 🎉\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });