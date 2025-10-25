import { network } from "hardhat";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "sepolia" });

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("⚙️  SETTING ENFORCED OPTIONS");
  console.log("=".repeat(50) + "\n");

  const ADAPTER = process.env.ADAPTER_ADDRESS || "0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E";
  const HEDERA_EID = parseInt(process.env.HEDERA_EID || "40285");

  const [signer] = await ethers.getSigners();
  console.log(`👛 Using account: ${signer.address}`);
  console.log(`📋 Adapter: ${ADAPTER}`);
  console.log(`📋 Hedera EID: ${HEDERA_EID}\n`);

  // Get adapter contract
  const adapter = await ethers.getContractAt("PYUSDAdapter", ADAPTER);

  // Create enforced options with proper gas settings
  // This tells LayerZero how much gas to use on the destination chain
  const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex();
  
  console.log(`⚙️  Setting enforced options...`);
  console.log(`   Options: ${options}`);
  console.log(`   Gas for lzReceive: 200,000\n`);

  try {
    // Set enforced options for msgType 1 (SEND)
    const enforcedOptions = [
      {
        eid: HEDERA_EID,
        msgType: 1,
        options: options,
      },
    ];

    const tx = await adapter.setEnforcedOptions(enforcedOptions);
    console.log(`📤 Transaction sent: ${tx.hash}`);
    console.log(`   Explorer: https://sepolia.etherscan.io/tx/${tx.hash}`);
    console.log("   ⏳ Waiting for confirmation...\n");

    await tx.wait();
    console.log("✅ Enforced options set successfully!\n");

    console.log("=".repeat(50));
    console.log("🎉 CONFIGURATION COMPLETE!");
    console.log("=".repeat(50));
    console.log("\n📋 Next Step: Bridge PYUSD");
    console.log("   Run: npx hardhat run scripts/bridge-pyusd.ts --network sepolia\n");
  } catch (error: any) {
    console.error("❌ Failed to set enforced options!");
    console.error(`   Error: ${error.message}\n`);
    
    if (error.message.includes("Ownable: caller is not the owner")) {
      console.log("   You are not the owner of this contract.");
      console.log("   Only the owner can set enforced options.\n");
    }
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });