import { network } from "hardhat";

const { ethers } = await network.connect({ network: "sepolia" });

async function main() {
  const ADAPTER_ADDRESS = "0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E"; // Your deployed adapter
  const OFT_ADDRESS = "0x6a87032589b837935b1a393dc905c84e908c6974";     // Your deployed OFT
  const HEDERA_EID = 40295;

  const adapter = await ethers.getContractAt("PYUSDAdapter", ADAPTER_ADDRESS);
  
  console.log("Setting peer on Sepolia...");
  const tx = await adapter.setPeer(HEDERA_EID, ethers.zeroPadValue(OFT_ADDRESS, 32));
  await tx.wait();
  
  console.log("✅ Peer set!");
  console.log("Now run this on Hedera network:");
  console.log(`await oft.setPeer(40161, ethers.zeroPadValue("${ADAPTER_ADDRESS}", 32))`);
}

main().catch(console.error);