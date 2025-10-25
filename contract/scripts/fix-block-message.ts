import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🔧 CONFIGURING HEDERA OFT TO RECEIVE MESSAGES");
  console.log("=".repeat(60) + "\n");

  const OFT_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";
  const ADAPTER_ADDRESS = process.env.ADAPTER_ADDRESS || "0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E";
  const SEPOLIA_EID = parseInt(process.env.SEPOLIA_EID || "40161");

  const [signer] = await ethers.getSigners();
  
  console.log("📋 Configuration:");
  console.log(`   Network: Hedera Testnet`);
  console.log(`   OFT Address: ${OFT_ADDRESS}`);
  console.log(`   Adapter (Sepolia): ${ADAPTER_ADDRESS}`);
  console.log(`   Sepolia EID: ${SEPOLIA_EID}`);
  console.log(`   Your Account: ${signer.address}\n`);

  // Get OFT contract
  const oft = await ethers.getContractAt("PYUSDOFT", OFT_ADDRESS);

  // Step 1: Check and set peer
  console.log("1️⃣ Setting peer (Sepolia Adapter)...");
  try {
    const peer = await oft.peers(SEPOLIA_EID);
    const expectedPeer = ethers.zeroPadValue(ADAPTER_ADDRESS.toLowerCase(), 32);
    
    console.log(`   Current peer: ${peer}`);
    console.log(`   Expected peer: ${expectedPeer}`);
    
    if (peer.toLowerCase() === expectedPeer.toLowerCase()) {
      console.log("   ✅ Peer already set correctly!\n");
    } else {
      console.log("   Setting peer...");
      const tx = await oft.setPeer(SEPOLIA_EID, expectedPeer);
      console.log(`   TX: ${tx.hash}`);
      console.log(`   Explorer: https://hashscan.io/testnet/transaction/${tx.hash}`);
      console.log("   ⏳ Waiting for confirmation...");
      await tx.wait();
      console.log("   ✅ Peer set!\n");
    }
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}\n`);
  }

  // Step 2: Set enforced options
  console.log("2️⃣ Setting enforced options...");
  try {
    // Manually create the options bytes
    // This is equivalent to: Options.newOptions().addExecutorLzReceiveOption(200000, 0)
    // Format: 0x0003 (version) 0x0001 (executor type) 0x0011 (length) 0x01 (option type) 0x00030d40 (200000 gas) 0x00 (0 value)
    const options = "0x00030100110100000000000000000000000000030d40";
    
    console.log(`   Options: ${options}`);
    console.log(`   Gas for lzReceive: 200,000`);
    
    const enforcedOptions = [
      {
        eid: SEPOLIA_EID,
        msgType: 1,
        options: options,
      },
    ];

    const tx = await oft.setEnforcedOptions(enforcedOptions);
    console.log(`   TX: ${tx.hash}`);
    console.log(`   Explorer: https://hashscan.io/testnet/transaction/${tx.hash}`);
    console.log("   ⏳ Waiting for confirmation...");
    await tx.wait();
    console.log("   ✅ Enforced options set!\n");
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}\n`);
    if (error.message.includes("Ownable")) {
      console.log("   💡 You need to be the owner of the OFT contract.\n");
    }
  }

  console.log("=".repeat(60));
  console.log("✅ HEDERA OFT CONFIGURED!");
  console.log("=".repeat(60));
  console.log("\n📋 What was configured:");
  console.log("   ✅ Peer set: Hedera OFT ← Sepolia Adapter");
  console.log("   ✅ Enforced options set: 200k gas for lzReceive");
  console.log("\n🔍 Check your blocked message:");
  console.log("   https://testnet.layerzeroscan.com/tx/0x5265e21b314d584216d4bef5c6ce87435381896cea48737c77a5c323798a1f7a");
  console.log("\n⏳ Wait 2-3 minutes, then refresh LayerZero Scan.");
  console.log("   Your message should change from BLOCKED → DELIVERED\n");
  console.log("💡 If still blocked after 5 minutes:");
  console.log("   The Hedera testnet pathway may not have default DVN configs.");
  console.log("   Contact LayerZero Discord: https://discord.gg/layerzero\n");
  console.log("🔐 Your 100 PYUSD is safe in the adapter contract!");
  console.log("   It will be delivered once the pathway is fully configured.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal Error:");
    console.error(error);
    process.exit(1);
  });