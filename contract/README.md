# Slime
Futarchy-DeFAI Protocol

A cross-chain DeFi protocol combining futarchy governance (prediction markets) with AI agents for PYUSD yield strategies.

## 🎯 What It Does

KOL Creators propose strategies → Community bets & funds → AI agents execute → Winners claim profits

**Core Flow:**
1. PYUSD bridges Sepolia → Hedera (via LayerZero)
2. Users bet YES/NO on strategy success
3. Community funds winning strategies
4. Vincent AI agents execute autonomously
5. Profits distributed to correct predictors

## ✅ Current Status (Testnet)

**Deployed & Working:**
- ✅ PYUSD Bridge (Sepolia ↔ Hedera) - 1000+ PYUSD bridged
- ✅ ProposalFutarchy Contract - Prediction markets live
- ✅ Complete Test Cycle - 31.67% ROI achieved
- ✅ Vincent Agent Integration - DCA scaffolding ready

**Contract Addresses:**
- PYUSDAdapter (Sepolia): `0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E`
- PYUSDOFT (Hedera): `0x6a87032589b837935b1a393dc905c84e908c6974`
- ProposalFutarchy (Hedera): `0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6`

**Latest Test Results:**
```
Strategy: "Meteora PYUSD Pool - 18% APR"
Investment: 60 PYUSD (10 bet + 50 funding)
Outcome: SUCCESS ✅
Profit: 19 PYUSD
ROI: +31.67%
```

## 🚀 Quick Reference Card - PYUSD Bridge

### 📦 Deployed Contracts

| Network | Contract | Address | Explorer |
|---------|----------|---------|----------|
| **Sepolia** | PYUSDAdapter | `0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E` | [View](https://eth-sepolia.blockscout.com/address/0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E#code) |
| **Hedera** | PYUSDOFT | `0x6a87032589b837935b1a393dc905c84e908c6974` | [View](https://hashscan.io/testnet/contract/0x6a87032589b837935b1a393dc905c84e908c6974) |
| **Hedera** | ProposalFutarchy | `0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6` | [View](https://hashscan.io/testnet/contract/0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6) |

### 🌉 Bridge Commands

**Bridge PYUSD (Sepolia → Hedera)**
```bash
npx hardhat run scripts/bridge-pyusd.ts --network sepolia
```

**Check Balance on Hedera**
```bash
npx hardhat run scripts/check-balance-hedera.ts --network hedera
```

### ✅ Verification Commands

**Sepolia (Etherscan/Blockscout)**
```bash
npx hardhat verify --network sepolia \
  0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E \
  "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" \
  "0x6EDCE65403992e310A62460808c4b910D972f10f" \
  "0xd6499417BbC291304fc16f6849A1717D45569494"
```

**Hedera (HashScan)**
```bash
npx hardhat hashscan-verify \
  0x6a87032589b837935b1a393dc905c84e908c6974 \
  --contract contracts/PYUSDOFT.sol:PYUSDOFT \
  --network hedera
```

### 🔗 Important Addresses

**Sepolia Testnet**
- **PYUSD Token:** `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **LayerZero Endpoint:** `0x6EDCE65403992e310A62460808c4b910D972f10f`
- **Chain ID:** 11155111
- **LayerZero EID:** 40161

**Hedera Testnet**
- **LayerZero Endpoint:** `0xbD672D1562Dd32C23B563C989d8140122483631d`
- **Chain ID:** 296
- **LayerZero EID:** 40285

### 📊 Bridge Statistics

- **Total Bridged:** 1,101 PYUSD
- **Average Time:** ~45 seconds
- **Average Fee:** ~0.00006 ETH (~$0.15)
- **Success Rate:** 100%

### 🔍 Live Transaction Examples

**Bridge Transaction:**
- [Sepolia TX](https://sepolia.etherscan.io/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788)
- [LayerZero Scan](https://testnet.layerzeroscan.com/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788)
- [Hedera Account](https://hashscan.io/testnet/account/0xd6499417BbC291304fc16f6849A1717D45569494)

**Futarchy Transactions:**
- [Create Proposal](https://hashscan.io/testnet/transaction/0xdb345e699b72dbe436d20e4024ab7fd2dc7f9dee1353f7a060f4623f851649be)
- [Buy YES Shares](https://hashscan.io/testnet/transaction/0x9703f3b165cd2307fedc4e0fd801bdd66d925f11a7a25e6ad3658c49ab647047)
- [Resolve Market](https://hashscan.io/testnet/transaction/0x1d49e321e6dfb7b9bf7c9d83aeb544b9f3ffa2cd5aaabd014146933d811cfcf1)
- [Claim Winnings](https://hashscan.io/testnet/transaction/0x9a6e9bec9a4b86b54e9ec0805da641993958392e60112d0de9c34a2981d6fa28)

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Install dependencies
npm install
npm install -D hashscan-verify

# Set keys
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set HEDERA_PRIVATE_KEY
npx hardhat keystore set ETHERSCAN_API_KEY
```

### 2. Bridge PYUSD
```bash
npx hardhat run scripts/bridge-pyusd.ts --network sepolia
npx hardhat run scripts/check-balance-hedera.ts --network hedera
```

### 3. Test Futarchy Protocol
```bash
npx hardhat run scripts/core/create-proposal.ts --network testnet
npx hardhat run scripts/core/resolve-and-claim.ts --network testnet
```

### 4. Run Vincent Agent
```bash
pnpm install
pnpm dev
```

## 📦 Project Structure

```
├── contract/                # Smart contracts
│   ├── contracts/
│   │   ├── PYUSDAdapter.sol       # Bridge adapter
│   │   ├── PYUSDOFT.sol           # Bridged token
│   │   └── ProposalFutarchy.sol   # Prediction markets
│   └── scripts/
│       ├── bridge-pyusd.ts
│       └── core/
│           ├── create-proposal.ts
│           └── resolve-and-claim.ts
├── packages/
│   ├── dca-frontend/        # React UI
│   └── dca-backend/         # Express API + scheduler
└── README.md
```

## 🔗 Resources

- [PYUSDAdapter (Sepolia)](https://eth-sepolia.blockscout.com/address/0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E#code)
- [PYUSDOFT (Hedera)](https://hashscan.io/testnet/contract/0x6a87032589b837935b1a393dc905c84e908c6974)
- [ProposalFutarchy (Hedera)](https://hashscan.io/testnet/contract/0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6)
- [Vincent Dashboard](https://dashboard.heyvincent.ai/)

## 📋 Next Steps

- [ ] Add Pyth oracle integration
- [ ] Build governance UI
- [ ] Deploy AgentTrigger contract
- [ ] Launch Galxe quest system
- [ ] Security audit
- [ ] Mainnet deployment

## 📝 License

MIT License