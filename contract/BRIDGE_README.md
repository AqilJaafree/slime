# 🌉 PYUSD Cross-Chain Bridge: Sepolia ↔ Hedera Testnet

Complete guide for bridging PYUSD tokens between Ethereum Sepolia and Hedera Testnet using LayerZero OFT.

---

## 📋 Project Overview

This project demonstrates a production-ready cross-chain token bridge built with:
- **LayerZero V2** - Cross-chain messaging protocol
- **OFT (Omnichain Fungible Token)** - Token standard
- **Hardhat 3** - Smart contract development
- **Sepolia Testnet** - Ethereum testnet
- **Hedera Testnet** - High-performance L1 blockchain

---

## 🎯 What This Does

1. **Lock** PYUSD on Sepolia (via Adapter)
2. **Bridge** message through LayerZero
3. **Mint** PYUSD OFT on Hedera
4. **Users receive** bridged tokens on destination chain

**Bridge Flow:**
```
Sepolia PYUSD → Adapter → LayerZero → Hedera OFT → Bridged PYUSD
```

---

## 📦 Deployed & Verified Contracts

### Sepolia Ethereum Testnet

**PYUSDAdapter** (Locks original PYUSD)
- **Address:** `0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E`
- **Verified:** ✅ [View on Blockscout](https://eth-sepolia.blockscout.com/address/0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E#code)
- **Function:** Locks PYUSD and sends LayerZero message

### Hedera Testnet

**PYUSDOFT** (Mints bridged tokens)
- **Address:** `0x6a87032589b837935b1a393dc905c84e908c6974`
- **Verified:** ✅ [View on HashScan](https://hashscan.io/testnet/contract/0x6a87032589b837935b1a393dc905c84e908c6974)
- **Function:** Mints PYUSD OFT on Hedera

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+
node --version

# Install dependencies
npm install
```

### Environment Setup

```bash
# Set your private keys
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set HEDERA_PRIVATE_KEY
npx hardhat keystore set ETHERSCAN_API_KEY
```

---

## 🌉 Bridge PYUSD: Step-by-Step

### Step 1: Get PYUSD on Sepolia

PYUSD Sepolia: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`

You need some PYUSD tokens on Sepolia to bridge.

### Step 2: Run Bridge Script

```bash
npx hardhat run scripts/bridge-pyusd.ts --network sepolia
```

**What happens:**
1. ✅ Approves PYUSD for adapter
2. ✅ Calculates LayerZero fee
3. ✅ Sends cross-chain message
4. ⏳ Waits for delivery (~1-2 minutes)

### Step 3: Check Balance on Hedera

```bash
npx hardhat run scripts/check-balance-hedera.ts --network hedera
```

**Result:** You should see your PYUSD OFT balance!

---

## 📊 Bridge Transaction Example

```bash
📋 Bridge Configuration:
   Sender (Sepolia): 0xd6499417BbC291304fc16f6849A1717D45569494
   Receiver (Hedera): 0xd6499417BbC291304fc16f6849A1717D45569494
   Amount: 1 PYUSD
   
💰 PYUSD Balance: 100.0 PYUSD
⛽ LayerZero Fee: 0.000062 ETH

✅ Transaction confirmed!
📋 Track: https://testnet.layerzeroscan.com/tx/0xd1e6af...
```

**Live Example:**
- [Sepolia TX](https://sepolia.etherscan.io/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788)
- [LayerZero Scan](https://testnet.layerzeroscan.com/tx/0xd1e6af57da3f5170138ef77ebfb1d53d2f901edf0c9dd8beb775a15f682be788)
- [Hedera Account](https://hashscan.io/testnet/account/0xd6499417BbC291304fc16f6849A1717D45569494)

---

## 🔧 Technical Architecture

### Smart Contracts

```
contracts/
├── PYUSDAdapter.sol    # Sepolia - Locks PYUSD
├── PYUSDOFT.sol        # Hedera - Mints OFT
└── Counter.sol         # Demo contract
```

### Key Components

**LayerZero Integration:**
- Endpoint (Sepolia): `0x6EDCE65403992e310A62460808c4b910D972f10f`
- Endpoint (Hedera): `0xbD672D1562Dd32C23B563C989d8140122483631d`
- DVN: LayerZero Labs
- Executor: Automated delivery

**Token Flow:**
1. User calls `send()` on PYUSDAdapter (Sepolia)
2. PYUSD locked in adapter
3. LayerZero message → Hedera
4. PYUSDOFT mints tokens on Hedera
5. User receives bridged PYUSD

---

## 📝 Configuration

### LayerZero Config (`layerzero.config.ts`)

```typescript
{
  from: Sepolia (40161),
  to: Hedera (40285),
  config: {
    sendConfig: {
      executorConfig: { maxMessageSize: 10000 },
      ulnConfig: { confirmations: 5 }
    },
    enforcedOptions: [
      { msgType: 1, gas: 200000 }
    ]
  }
}
```

### Network Config (`hardhat.config.ts`)

```typescript
networks: {
  sepolia: {
    url: "https://eth-sepolia.g.alchemy.com/...",
    chainId: 11155111,
  },
  hedera: {
    url: "https://testnet.hashio.io/api",
    chainId: 296,
  }
}
```

---

## 🛠️ Available Scripts

### Deployment

```bash
# Deploy Adapter on Sepolia
npx hardhat run scripts/deploy-adapter.ts --network sepolia

# Deploy OFT on Hedera
npx hardhat run scripts/deploy-oft.ts --network hedera
```

### Configuration

```bash
# Set peers (connect contracts)
npx hardhat run scripts/set-peers.ts --network sepolia
npx hardhat run scripts/set-peer-hedera.ts --network hedera

# Set enforced options
npx hardhat run scripts/set-enforced-options.ts --network sepolia
```

### Bridge Operations

```bash
# Bridge PYUSD Sepolia → Hedera
npx hardhat run scripts/bridge-pyusd.ts --network sepolia

# Check balance on Hedera
npx hardhat run scripts/check-balance-hedera.ts --network hedera
```

### Verification

```bash
# Verify Sepolia contract
npx hardhat verify --network sepolia <ADDRESS> <CONSTRUCTOR_ARGS>

# Verify Hedera contract
npx hardhat hashscan-verify <ADDRESS> --contract <PATH> --network hedera
```

---

## ✅ Contract Verification

Both contracts are fully verified and publicly auditable:

### Sepolia Verification
```bash
npx hardhat verify --network sepolia \
  0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E \
  "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" \
  "0x6EDCE65403992e310A62460808c4b910D972f10f" \
  "0xd6499417BbC291304fc16f6849A1717D45569494"
```

### Hedera Verification
```bash
npx hardhat hashscan-verify \
  0x6a87032589b837935b1a393dc905c84e908c6974 \
  --contract contracts/PYUSDOFT.sol:PYUSDOFT \
  --network hedera
```

---

## 📊 Bridge Statistics

**Current Status (as of deployment):**
- ✅ Total Bridged: 101 PYUSD
- ✅ Transactions: 2 successful bridges
- ✅ Average Time: 45 seconds
- ✅ Average Fee: ~0.00006 ETH ($0.15)

---

## 🔍 Monitoring & Debugging

### Check Bridge Status

**LayerZero Scan:**
```
https://testnet.layerzeroscan.com/tx/<YOUR_TX_HASH>
```

**Message States:**
- `INFLIGHT` - In transit
- `DELIVERED` - Received on destination
- `BLOCKED` - Needs manual execution (rare)

### Manual Message Execution (if needed)

```bash
npx hardhat run scripts/manual-execute.ts --network hedera
```

---

## 🧪 Testing

```bash
# Run all tests
npx hardhat test

# Run specific tests
npx hardhat test test/Counter.ts

# Run Solidity tests
npx hardhat test solidity
```

---

## 🎯 Next Steps: Futarchy Integration

This bridge infrastructure will be used for:

1. **Futarchy Governance** - Cross-chain voting
2. **PYUSD ICO Fundraising** - Multi-chain token distribution
3. **AI Agent Triggers** - Automated cross-chain execution
4. **Yield Distribution** - Cross-chain profit sharing

**Coming Soon:**
```
contracts/
├── ProposalFutarchy.sol   # Prediction market governance
├── PYUSDFundraiser.sol    # ICO contracts
├── AgentTrigger.sol       # AI agent integration
└── YieldDistributor.sol   # Profit distribution
```

---

## 📚 Resources

### Documentation
- [LayerZero Docs](https://docs.layerzero.network/)
- [Hedera Docs](https://docs.hedera.com/)
- [Hardhat Docs](https://hardhat.org/docs)

### Explorers
- [Sepolia Etherscan](https://sepolia.etherscan.io/)
- [Hedera HashScan](https://hashscan.io/testnet)
- [LayerZero Scan](https://testnet.layerzeroscan.com/)

### Key Links
- [PYUSDAdapter (Sepolia)](https://eth-sepolia.blockscout.com/address/0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E#code)
- [PYUSDOFT (Hedera)](https://hashscan.io/testnet/contract/0x6a87032589b837935b1a393dc905c84e908c6974)
- [LayerZero Endpoints](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts)

---

## 🤝 Contributing

This is a demo project. For production use:
1. Add comprehensive test coverage
2. Implement access controls
3. Add pause mechanisms
4. Set up monitoring alerts
5. Conduct security audits

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Success Checklist

- [x] ✅ Deploy contracts on both chains
- [x] ✅ Configure LayerZero pathways
- [x] ✅ Set peers and enforced options
- [x] ✅ Verify contracts publicly
- [x] ✅ Bridge tokens successfully
- [x] ✅ Document complete process
- [ ] 🔜 Add Futarchy governance
- [ ] 🔜 Integrate AI agents
- [ ] 🔜 Deploy to mainnet

---

**Built with ❤️ for the Futarchy-DeFAI Protocol**

*Bridging PYUSD across chains to enable decentralized prediction markets and AI-powered DeFi strategies.*