import { network } from "hardhat";

const { ethers } = await network.connect({ network: "sepolia" });

async function main() {
  const PYUSD = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  const ADAPTER = "0x...";   // Your adapter
  const RECIPIENT = "0x..."; // Hedera recipient
  const AMOUNT = "100";
  const HEDERA_EID = 40295;

  const [signer] = await ethers.getSigners();
  
  // Approve
  const pyusd = await ethers.getContractAt(
    ["function approve(address,uint256)"],
    PYUSD
  );
  const amount = ethers.parseUnits(AMOUNT, 6);
  await pyusd.approve(ADAPTER, amount);
  console.log("✅ Approved");

  // Bridge
  const adapter = await ethers.getContractAt("PYUSDAdapter", ADAPTER);
  const sendParam = {
    dstEid: HEDERA_EID,
    to: ethers.zeroPadValue(RECIPIENT, 32),
    amountLD: amount,
    minAmountLD: amount * 99n / 100n,
    extraOptions: "0x",
    composeMsg: "0x",
    oftCmd: "0x"
  };

  const fee = await adapter.quoteSend(sendParam, false);
  console.log("Fee:", ethers.formatEther(fee.nativeFee), "ETH");

  const tx = await adapter.send(
    sendParam,
    { nativeFee: fee.nativeFee, lzTokenFee: 0 },
    signer.address,
    { value: fee.nativeFee }
  );

  console.log("✅ Bridged! TX:", tx.hash);
}

main().catch(console.error);