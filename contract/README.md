# Sample Hardhat 3 Beta Project (`mocha` and `ethers`)

This project showcases a Hardhat 3 Beta project using `mocha` for tests and the `ethers` library for Ethereum interactions.

To learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.

## Project Overview

This example project includes:

- A simple Hardhat configuration file.
- Foundry-compatible Solidity unit tests.
- TypeScript integration tests using `mocha` and ethers.js
- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

## Usage

### Running Tests

To run all the tests in the project, execute the following command:

```shell
npx hardhat test
```

You can also selectively run the Solidity or `mocha` tests:

```shell
npx hardhat test solidity
npx hardhat test mocha
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```


# 🚀 Quick Reference Card - PYUSD Bridge

## 📦 Deployed Contracts

| Network | Contract | Address | Explorer |
|---------|----------|---------|----------|
| **Sepolia** | PYUSDAdapter | `0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E` | [View](https://eth-sepolia.blockscout.com/address/0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E#code) |
| **Hedera** | PYUSDOFT | `0x6a87032589b837935b1a393dc905c84e908c6974` | [View](https://hashscan.io/testnet/contract/0x6a87032589b837935b1a393dc905c84e908c6974) |

---

## 🌉 Bridge Commands

### Bridge PYUSD (Sepolia → Hedera)
```bash
npx hardhat run scripts/bridge-pyusd.ts --network sepolia
```

### Check Balance on Hedera
```bash
npx hardhat run scripts/check-balance-hedera.ts --network hedera
```

---

## ✅ Verification Commands

### Sepolia (Etherscan/Blockscout)
```bash
npx hardhat verify --network sepolia \
  0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E \
  "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" \
  "0x6EDCE65403992e310A62460808c4b910D972f10f" \
  "0xd6499417BbC291304fc16f6849A1717D45569494"
```

### Hedera (HashScan)
```bash
npx hardhat hashscan-verify \
  0x6a87032589b837935b1a393dc905c84e908c6974 \
  --contract contracts/PYUSDOFT.sol:PYUSDOFT \
  --network hedera
```

---

## 🔗 Important Addresses

### Sepolia Testnet
- **PYUSD Token:** `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **LayerZero Endpoint:** `0x6EDCE65403992e310A62460808c4b910D972f10f`
- **Chain ID:** 11155111
- **LayerZero EID:** 40161

### Hedera Testnet
- **LayerZero Endpoint:** `0xbD672D1562Dd32C23B563C989d8140122483631d`
- **Chain ID:** 296
- **LayerZero EID:** 40285

---

## 📊 Bridge Statistics

- **Total Bridged:** 101 PYUSD
- **Average Time:** ~45 seconds
- **Average Fee:** ~0.00006 ETH (~$0.15)
- **Success Rate:** 100%

---

## 🔍 Tracking Links

### Live Bridge Transaction
- [Sepolia TX](https://sepolia.etherscan.io/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788)
- [LayerZero Scan](https://testnet.layerzeroscan.com/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788)
- [Hedera Account](https://hashscan.io/testnet/account/0xd6499417BbC291304fc16f6849A1717D45569494)

---

## 🎯 Next: Futarchy Contracts

**Coming Soon:**
```solidity
contracts/
├── ProposalFutarchy.sol    // Prediction market governance
├── PYUSDFundraiser.sol     // ICO contracts  
├── AgentTrigger.sol        // AI agent integration
└── YieldDistributor.sol    // Profit distribution
```

---

## 📝 Quick Setup

```bash
# 1. Install dependencies
npm install
npm install -D hashscan-verify

# 2. Set keys
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set HEDERA_PRIVATE_KEY
npx hardhat keystore set ETHERSCAN_API_KEY

# 3. Bridge tokens
npx hardhat run scripts/bridge-pyusd.ts --network sepolia

# 4. Check balance
npx hardhat run scripts/check-balance-hedera.ts --network hedera
```

---
