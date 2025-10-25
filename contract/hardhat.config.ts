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
    // For hashscan-verify, use "testnet" not "hedera"
    testnet: {
      type: "http",
      chainType: "l1",
      url: "https://testnet.hashio.io/api",
      accounts: [configVariable("HEDERA_PRIVATE_KEY")],
      // chainId: 296, // ← Remove this, hashscan-verify auto-detects
    },
    // Or keep both if you want to use "hedera" elsewhere
    hedera: {
      type: "http",
      chainType: "l1",
      url: "https://testnet.hashio.io/api",
      accounts: [configVariable("HEDERA_PRIVATE_KEY")],
    },
  },
  // Remove this section - hashscan-verify doesn't need it
  // verify: {
  //   etherscan: {
  //     apiKey: configVariable("ETHERSCAN_API_KEY"),
  //   },
  // },
};

export default config;