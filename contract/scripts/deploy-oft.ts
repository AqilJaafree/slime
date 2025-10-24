import { network } from "hardhat";

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  const LZ_ENDPOINT_HEDERA = "0xbD672D1562Dd32C23B563C989d8140122483631d";

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const PYUSDOFT = await ethers.getContractFactory("PYUSDOFT");
  const oft = await PYUSDOFT.deploy(LZ_ENDPOINT_HEDERA, deployer.address);

  await oft.waitForDeployment();
  console.log("✅ OFT deployed:", await oft.getAddress());
}

main().catch(console.error);