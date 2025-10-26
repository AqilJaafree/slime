# SLIME - Futarchy Prediction Markets 🚀

**Vote on DeFi strategies, fund winners, earn rewards - powered by prediction markets on Hedera**

![Hedera](https://img.shields.io/badge/Hedera-Testnet-purple)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 Overview

SLIME is a futarchy-based prediction market protocol that brings accountability to DeFi alpha sharing. Instead of trusting influencers' words, users can see their on-chain positions and only winning predictions get funded and executed automatically.

### The Problem We Solve

1. **KOL Accountability Crisis**: Crypto influencers shill strategies with zero skin in the game
2. **Information Asymmetry**: Users can't tell good strategies from bad ones
3. **No Consequences**: Wrong predictions cost followers money while KOLs face nothing
4. **Manual Execution**: Even good strategies require manual work to implement

### Our Solution

- 💰 **Stake Capital**: Predictors must buy YES/NO shares with real money
- 🔍 **Transparent Positions**: All predictions are public on-chain
- 🤖 **Automated Execution**: Winning strategies get funded and executed by agents
- 📊 **Market Wisdom**: Prices aggregate collective intelligence
- ⚡ **Fast & Cheap**: Built on Hedera for instant settlement

---

## 🏗️ Architecture
```
┌─────────────────┐
│   Frontend      │  Next.js 15 + Tailwind v4
│  (slime-fe)     │  MetaMask Integration
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Smart Contracts │  Hedera Testnet (Chain 296)
│  - Futarchy     │  ProposalFutarchy.sol
│  - AgentTrigger │  AgentTrigger.sol
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vincent Agent  │  Automated Strategy Execution
│  - HBARX Stake  │  Yield Reporting
│  - Yield Report │  On-chain Proofs
└─────────────────┘
```

## 📝 Smart Contracts (Hedera Testnet)

### Verified Contracts

| Contract Name | Address | HashScan Link |
|---------------|---------|---------------|
| **ProposalFutarchy** | `0xbe6cb70Ce7C6A300E45c5B6ECA2Ee73cb2b74902` | [View Contract →](https://hashscan.io/testnet/contract/0xbe6cb70Ce7C6A300E45c5B6ECA2Ee73cb2b74902) |
| **AgentTrigger** | `0x081dEd6F31eBeC1F2eCEdDE5d97384f66148be21` | [View Contract →](https://hashscan.io/testnet/contract/0x081dEd6F31eBeC1F2eCEdDE5d97384f66148be21) |

### Token Contracts

| Token | Symbol | Address | HashScan Link |
|-------|--------|---------|---------------|
| **PayPal USD (LayerZero OFT)** | PYUSD | `0x6a87032589b837935b1a393dc905c84e908c6974` | [View Token →](https://hashscan.io/testnet/token/0x6a87032589b837935b1a393dc905c84e908c6974) |
| **HBAR Liquid Staking** | HBARX | `0x25e1f00FEcf777cc2d9246Ccad0C28936C0DEdDb` | [View Token →](https://hashscan.io/testnet/token/0x25e1f00FEcf777cc2d9246Ccad0C28936C0DEdDb) |

### Backend Wallet

| Purpose | Address |
|---------|---------|
| **Agent Executor** | `0xd6499417BbC291304fc16f6849A1717D45569494` |

### Network Information

```
Network Name: Hedera Testnet
Chain ID: 296 (0x128 in hex)
RPC URL: https://testnet.hashio.io/api
Currency Symbol: HBAR
Block Explorer: https://hashscan.io/testnet
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- MetaMask wallet
- Hedera Testnet HBAR & PYUSD

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/slime-fe.git
cd slime-fe

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Add contract addresses to .env.local
NEXT_PUBLIC_HEDERA_RPC_URL=https://testnet.hashio.io/api
NEXT_PUBLIC_CHAIN_ID=296
NEXT_PUBLIC_FUTARCHY_ADDRESS=0xbe6cb70Ce7C6A300E45c5B6ECA2Ee73cb2b74902
NEXT_PUBLIC_AGENT_TRIGGER_ADDRESS=0x081dEd6F31eBeC1F2eCEdDE5d97384f66148be21
NEXT_PUBLIC_HBARX_ADDRESS=0x25e1f00FEcf777cc2d9246Ccad0C28936C0DEdDb
NEXT_PUBLIC_PYUSD_ADDRESS=0x6a87032589b837935b1a393dc905c84e908c6974
NEXT_PUBLIC_BACKEND_WALLET=0xd6499417BbC291304fc16f6849A1717D45569494

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📋 Contract ABIs

### ProposalFutarchy Core Functions

```solidity
// Create a new strategy proposal
function createProposal(
    string memory strategyName, 
    uint256 targetAPR,              // Basis points (650 = 6.5%)
    uint256 fundingGoal,            // Amount in PYUSD (6 decimals)
    uint256 duration                // Duration in seconds
) external returns (uint256 proposalId)

// Buy prediction shares (YES or NO)
function buyShares(
    uint256 proposalId,
    bool isYes,                     // true = YES, false = NO
    uint256 amount                  // Amount in PYUSD (6 decimals)
) external

// Fund a winning strategy
function fundStrategy(
    uint256 proposalId,
    uint256 amount                  // Amount in PYUSD (6 decimals)
) external

// Resolve market outcome
function resolveMarket(uint256 proposalId) external

// Claim winnings for correct predictions
function claimWinnings(uint256 proposalId) external

// View functions
function getProposal(uint256 id) external view returns (
    uint256 id,
    address creator,
    string memory strategyName,
    uint256 targetAPR,
    uint256 fundingGoal,
    uint256 fundingRaised,
    uint256 deadline,
    uint8 status,
    uint8 outcome
)

function getMarket(uint256 id) external view returns (
    uint256 yesPool,
    uint256 noPool,
    uint256 totalYesShares,
    uint256 totalNoShares
)

function getUserPosition(uint256 proposalId, address user) external view returns (
    uint256 yesShares,
    uint256 noShares,
    uint256 fundingContributed,
    bool claimed
)
```

### AgentTrigger Functions

```solidity
// Register an agent for a proposal
function registerAgent(
    uint256 proposalId,
    address agent,
    string memory appId
) external

// Report actual yield achieved
function reportYield(
    uint256 proposalId,
    uint256 actualAPR,              // Basis points
    bytes memory proof              // Proof data
) external

// Deactivate an agent
function deactivateAgent(uint256 proposalId) external

// View agent information
function getAgentInfo(uint256 proposalId) external view returns (
    address agentAddress,
    string memory appId,
    bool isActive,
    uint256 reportedAPR
)
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with Turbopack
- **TypeScript 5** - Type safety
- **Tailwind CSS v4** - Styling
- **Ethers.js 6** - Blockchain interaction
- **Lucide React** - Icons

### Smart Contracts
- **Solidity 0.8.28** - Contract language
- **Hardhat** - Development environment
- **OpenZeppelin** - Security libraries

### Blockchain
- **Hedera Hashgraph** - Layer 1 (Chain ID: 296)
- **Hedera JSON-RPC Relay** - EVM compatibility
- **LayerZero** - Cross-chain messaging (PYUSD bridge)

### Automation
- **Vincent by Lit Protocol** - Agent framework

---

## 💡 How to Use

### 1. Add Hedera Testnet to MetaMask

```
Network Name: Hedera Testnet
RPC URL: https://testnet.hashio.io/api
Chain ID: 296
Currency Symbol: HBAR
Block Explorer: https://hashscan.io/testnet
```

### 2. Get Test Tokens

- **HBAR**: [Hedera Portal](https://portal.hedera.com)
- **PYUSD**: Bridge from Sepolia via LayerZero

### 3. Create a Proposal

```javascript
// Example values
strategyName: "HBARX Liquid Staking"
targetAPR: 650                    // 6.5%
fundingGoal: 1000000000           // 1000 PYUSD (6 decimals)
duration: 604800                  // 7 days in seconds
```

### 4. Buy Prediction Shares

```javascript
proposalId: 1
isYes: true                       // or false for NO
amount: 10000000                  // 10 PYUSD (6 decimals)
```

### 5. Fund Winning Strategy

```javascript
proposalId: 1
amount: 100000000                 // 100 PYUSD (6 decimals)
```

### 6. Claim Winnings

```javascript
proposalId: 1
// Call after market resolves
```

---

## 📁 Project Structure

```
slime-fe/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ProposalsList.tsx
│   │   ├── CreateProposal.tsx
│   │   ├── BuyShares.tsx
│   │   ├── FundStrategy.tsx
│   │   ├── ClaimWinnings.tsx
│   │   └── MyPositions.tsx
│   ├── context/
│   │   └── WalletContext.tsx
│   ├── lib/
│   │   └── contracts.ts
│   └── global.d.ts
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## 🔒 Security

### Smart Contract Security
- ✅ OpenZeppelin contracts
- ✅ Reentrancy guards
- ✅ Access control
- ✅ SafeERC20 usage

### Audits
- ⏳ Smart contract audit pending

### Bug Bounty
Report vulnerabilities to: security@slime.finance

---

## 📊 Gas Costs (Hedera Testnet)

| Operation | Estimated Cost |
|-----------|----------------|
| Create Proposal | ~$0.01 USD |
| Buy Shares | ~$0.005 USD |
| Fund Strategy | ~$0.005 USD |
| Claim Winnings | ~$0.003 USD |

**Total: ~$0.023 USD for complete flow** 🔥

---

## 🎯 Features

### ✅ Implemented
- [x] Create proposals
- [x] Buy YES/NO shares
- [x] Fund strategies
- [x] Claim winnings
- [x] View proposals
- [x] Track positions
- [x] MetaMask integration

### 🔄 Coming Soon
- [ ] Market resolution automation
- [ ] KOL leaderboard
- [ ] Reputation system
- [ ] Mobile app
- [ ] Mainnet deployment

---

## 🌐 Links

- **HashScan**: [View Contracts](https://hashscan.io/testnet/contract/0xbe6cb70Ce7C6A300E45c5B6ECA2Ee73cb2b74902)
- **Documentation**: Coming soon

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

- **Hedera** - Fast, cheap, eco-friendly blockchain
- **LayerZero** - Cross-chain PYUSD bridging
- **OpenZeppelin** - Secure smart contracts
- **Vincent/Lit Protocol** - Agent automation

---


---

**Built with ❤️ on Hedera | Powered by Prediction Markets | Accountability by Design**

⚡ **SLIME - Where alpha meets accountability** ⚡