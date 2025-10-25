import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 MANUALLY EXECUTING LAYERZERO MESSAGE");
  console.log("=".repeat(50) + "\n");

  const HEDERA_ENDPOINT = "0xbD672D1562Dd32C23B563C989d8140122483631d";
  const OFT_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";
  
  const [signer] = await ethers.getSigners();
  console.log(`👛 Using account: ${signer.address}\n`);

  // Get endpoint contract with minimal ABI
  const endpoint = new ethers.Contract(
    HEDERA_ENDPOINT,
    [
      "function lzReceive(tuple(uint32 srcEid, bytes32 sender, uint64 nonce) _origin, bytes32 _guid, bytes _message, address _executor, bytes _extraData) external payable",
      "function executable(tuple(uint32 srcEid, bytes32 sender, uint64 nonce) _origin, bytes32 _guid) external view returns (bool)",
      "function verifiable(tuple(uint32 srcEid, bytes32 sender, uint64 nonce) _origin, bytes32 _guid) external view returns (bool)"
    ],
    signer
  );

  // Origin data from LayerZero scan
  const origin = {
    srcEid: 40161, // Sepolia
    sender: ethers.zeroPadValue("0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E".toLowerCase(), 32),
    nonce: 2
  };

  const GUID = "0xb9620c94e089af71dbd4ee75cb17e3eb2dfbc7eb63ec85cea1cdfcbc2b5c393f";
  
  // Message data from scan (receiver address + amount)
  const message = "0x000000000000000000000000d6499417bbc291304fc16f6849a1717d45569494000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240";

  console.log("📋 Message Details:");
  console.log(`   Origin EID: ${origin.srcEid}`);
  console.log(`   Sender: ${origin.sender}`);
  console.log(`   Nonce: ${origin.nonce}`);
  console.log(`   GUID: ${GUID}`);
  console.log(`   Message: ${message}\n`);

  console.log("🔍 Checking if message is verifiable...");
  try {
    const isVerifiable = await endpoint.verifiable(origin, GUID);
    console.log(`   Verifiable: ${isVerifiable}`);
    
    if (!isVerifiable) {
      console.log("   ❌ Message not yet verifiable. DVN verification pending.\n");
      return;
    }
  } catch (error: any) {
    console.error(`   ❌ Error checking verifiable: ${error.message}\n`);
    return;
  }

  console.log("🔍 Checking if message is executable...");
  try {
    const isExecutable = await endpoint.executable(origin, GUID);
    console.log(`   Executable: ${isExecutable}\n`);

    if (!isExecutable) {
      console.log("❌ Message is not yet executable.");
      console.log("   This means it's verified but not ready for execution yet.\n");
      console.log("💡 Possible reasons:");
      console.log("   1. Waiting for block confirmations");
      console.log("   2. Message already executed");
      console.log("   3. Pathway configuration issue\n");
      return;
    }

    console.log("✅ Message is ready for execution!");
    console.log("📤 Executing message...\n");
    
    // Estimate gas first
    const gasEstimate = await endpoint.lzReceive.estimateGas(
      origin,
      GUID,
      message,
      signer.address,
      "0x"
    );
    console.log(`⛽ Estimated gas: ${gasEstimate}\n`);

    const tx = await endpoint.lzReceive(
      origin,
      GUID,
      message,
      signer.address,
      "0x",
      { gasLimit: gasEstimate * 120n / 100n } // 20% buffer
    );
    
    console.log(`📤 Transaction sent: ${tx.hash}`);
    console.log(`   Explorer: https://hashscan.io/testnet/transaction/${tx.hash}`);
    console.log("   ⏳ Waiting for confirmation...\n");
    
    const receipt = await tx.wait();
    console.log("✅ Message executed successfully!");
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed}\n`);

    console.log("=".repeat(50));
    console.log("🎉 SUCCESS!");
    console.log("=".repeat(50));
    console.log("\n💰 Check your PYUSD balance on Hedera:");
    console.log("   https://hashscan.io/testnet/account/0xd6499417BbC291304fc16f6849A1717D45569494");
    console.log("\n🔍 Verify on LayerZero Scan:");
    console.log("   https://testnet.layerzeroscan.com/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788\n");
    
  } catch (error: any) {
    console.error("❌ Execution failed!");
    console.error(`   Error: ${error.message}\n`);
    
    if (error.message.includes("LzReceiver_Executed")) {
      console.log("💡 This message was already executed!\n");
      console.log("   Check your Hedera account for the PYUSD tokens.");
    } else if (error.message.includes("NotExecutable")) {
      console.log("💡 Message is verified but not executable yet.");
      console.log("   Wait a few more minutes for the executor.\n");
    } else if (error.message.includes("InvalidReceiver")) {
      console.log("💡 The OFT contract might not be properly configured.\n");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal Error:");
    console.error(error);
    process.exit(1);
  });