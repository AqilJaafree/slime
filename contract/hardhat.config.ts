import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable } from "hardhat/config";
import hashscanVerify from "hashscan-verify";

const config: HardhatUserConfig = {
  plugins: [
    hardhatToolboxMochaEthersPlugin,
    hashscanVerify,
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: "https://eth-sepolia.g.alchemy.com/v2/3TD4Qp-ol2qGp69d3LBv3lBWlHrvaynY",
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    hedera: {
      type: "http",
      chainType: "l1",
      url: "https://testnet.hashio.io/api",
      chainId: 296, // ✅ FIXED
      accounts: [configVariable("HEDERA_PRIVATE_KEY")],
    },
  },
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
};

export default config;