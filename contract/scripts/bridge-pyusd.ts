import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "sepolia" });

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🌉 BRIDGING PYUSD: SEPOLIA → HEDERA");
  console.log("=".repeat(50) + "\n");

  // Configuration
  const PYUSD = process.env.PYUSD_SEPOLIA || "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  const ADAPTER = process.env.ADAPTER_ADDRESS || "0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E";
  const SENDER = process.env.SENDER_ADDRESS || "0xd6499417BbC291304fc16f6849A1717D45569494";
  const RECEIVER = process.env.RECEIVER_ADDRESS || "0xd6499417BbC291304fc16f6849A1717D45569494";
  const AMOUNT = process.env.BRIDGE_AMOUNT || "1";
  const HEDERA_EID = parseInt(process.env.HEDERA_EID || "40285");
  
  const [signer] = await ethers.getSigners();
  
  console.log("📋 Bridge Configuration:");
  console.log(`   Sender (Sepolia): ${SENDER}`);
  console.log(`   Receiver (Hedera): ${RECEIVER}`);
  console.log(`   Amount: ${AMOUNT} PYUSD`);
  console.log(`   Adapter: ${ADAPTER}`);
  console.log(`   Hedera EID: ${HEDERA_EID}\n`);

  // Get contracts with proper ABI
  const pyusd = await ethers.getContractAt(
    ["function approve(address,uint256) returns (bool)", "function balanceOf(address) view returns (uint256)"],
    PYUSD
  );

  // Use the deployed adapter contract directly
  const adapter = await ethers.getContractAt("PYUSDAdapter", ADAPTER);

  // Check balances
  console.log("🔍 Checking balances...");
  const balance = await pyusd.balanceOf(SENDER);
  console.log(`💰 PYUSD Balance: ${ethers.formatUnits(balance, 6)} PYUSD`);

  const amount = ethers.parseUnits(AMOUNT, 6);
  
  if (balance < amount) {
    console.error(`\n❌ Insufficient PYUSD balance!\n`);
    return;
  }

  const ethBalance = await ethers.provider.getBalance(SENDER);
  console.log(`💰 ETH Balance: ${ethers.formatEther(ethBalance)} ETH\n`);

  // Step 1: Approve
  console.log("1️⃣ Approving PYUSD for adapter...");
  const approveTx = await pyusd.approve(ADAPTER, amount);
  console.log(`   TX: ${approveTx.hash}`);
  await approveTx.wait();
  console.log("   ✅ Approved!\n");

  // Step 2: Prepare SendParam struct
  const sendParam = {
    dstEid: HEDERA_EID,
    to: ethers.zeroPadValue(RECEIVER, 32),
    amountLD: amount,
    minAmountLD: (amount * 99n) / 100n,
    extraOptions: "0x",
    composeMsg: "0x",
    oftCmd: "0x"
  };

  console.log("2️⃣ Calculating LayerZero fee...");
  
  try {
    // Call quoteSend using the contract's ABI
    const feeQuote = await adapter.quoteSend(sendParam, false);
    console.log(`   LayerZero Fee: ${ethers.formatEther(feeQuote.nativeFee)} ETH`);
    
    if (ethBalance < feeQuote.nativeFee) {
      console.error(`\n❌ Insufficient ETH for fee!\n`);
      return;
    }
    console.log("   ✅ Sufficient ETH\n");

    // Step 3: Send
    console.log("3️⃣ Sending PYUSD cross-chain...");
    const messagingFee = {
      nativeFee: feeQuote.nativeFee,
      lzTokenFee: 0n
    };

    const bridgeTx = await adapter.send(
      sendParam,
      messagingFee,
      SENDER,
      { value: feeQuote.nativeFee }
    );

    console.log(`📤 Transaction sent: ${bridgeTx.hash}`);
    console.log(`   Sepolia: https://sepolia.etherscan.io/tx/${bridgeTx.hash}`);
    console.log("   ⏳ Waiting for confirmation...\n");

    const receipt = await bridgeTx.wait();
    console.log("✅ Transaction confirmed!");

    console.log("=".repeat(50));
    console.log("🎉 BRIDGE INITIATED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📋 Track your transaction:");
    console.log(`   LayerZero: https://testnet.layerzeroscan.com/tx/${bridgeTx.hash}`);
    console.log(`   Hedera Account: https://hashscan.io/testnet/account/${RECEIVER}`);
    console.log("\n⏱️  Wait ~30-60 seconds for PYUSD to appear on Hedera\n");
  } catch (error: any) {
    console.error("❌ Error:");
    console.error(error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Fatal error:");
    console.error(error);
    process.exit(1);
  });