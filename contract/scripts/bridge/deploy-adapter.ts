import { network } from "hardhat";

const { ethers } = await network.connect({ network: "sepolia" });

async function main() {
  const PYUSD_SEPOLIA = "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9";
  const LZ_ENDPOINT_SEPOLIA = "0x6EDCE65403992e310A62460808c4b910D972f10f";

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const PYUSDAdapter = await ethers.getContractFactory("PYUSDAdapter");
  const adapter = await PYUSDAdapter.deploy(
    PYUSD_SEPOLIA,
    LZ_ENDPOINT_SEPOLIA,
    deployer.address
  );

  await adapter.waitForDeployment();
  console.log("✅ Adapter deployed:", await adapter.getAddress());
}

main().catch(console.error);