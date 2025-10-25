# 🚀 Futarchy + Vincent Integration Plan

## 📋 Project Overview

**Goal:** Add automated AI agent execution to the Futarchy prediction market protocol using Vincent (Lit Protocol).

**Current Status:** 
- ✅ ProposalFutarchy.sol deployed on Hedera
- ✅ PYUSD bridge working (Sepolia → Hedera)
- ✅ Prediction markets functional (31.67% ROI achieved)
- ❌ No actual strategy execution (manual only)

**Target:** Enable Vincent AI agents to automatically execute yield strategies when markets resolve YES.

---

## 🎯 Integration Objectives

### Phase 1: Smart Contracts (Week 1)
1. Deploy `AgentTrigger.sol` on Hedera
2. Update `ProposalFutarchy.sol` with reporting functions
3. Create custom Vincent abilities for Hedera DeFi protocols

### Phase 2: Backend Infrastructure (Week 2-3)
1. Set up event listener for `MarketResolved` events
2. Build strategy execution logic
3. Implement yield harvesting system
4. Add on-chain result reporting

### Phase 3: Frontend Integration (Week 4)
1. Add Vincent authentication flow
2. Build proposal browsing UI
3. Create funding + betting interface
4. Show agent execution status

### Phase 4: Testing & Deployment (Week 5)
1. End-to-end testing on Hedera testnet
2. Security audit
3. Mainnet deployment
4. Documentation

---

## 🏗️ Technical Architecture

### Current Flow
```
User → ProposalFutarchy → Bet/Fund → Manual Resolve → Claim
```

### New Flow with Vincent
```
User → Connect Vincent → ProposalFutarchy → Bet/Fund → 
  → Market Resolves → Vincent Listens → Execute Strategy → 
  → Harvest Yield (30d) → Report Results → User Claims (with yield!)
```

### System Components
```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Next.js)                │
│  - Vincent authentication                                    │
│  - Proposal browsing                                         │
│  - Fund + bet interface                                      │
│  - Position tracking                                         │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────────┐
│              Backend (Node.js + Express)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Event Listener (MarketResolved)                      │   │
│  │  → Triggers strategy execution                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Agenda Job Scheduler                                 │   │
│  │  → executeYieldStrategy                              │   │
│  │  → harvestYield (scheduled 30 days later)            │   │
│  │  → reportResults                                     │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Lit Protocol                               │
│  - PKP wallet management                                     │
│  - Permission verification                                   │
│  - Transaction signing                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Hedera Blockchain                           │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ ProposalFutarchy.sol │  │ AgentTrigger.sol     │        │
│  │ - Proposals          │  │ - Agent registry     │        │
│  │ - Betting            │  │ - Yield reporting    │        │
│  │ - Resolution         │  │                      │        │
│  └──────────────────────┘  └──────────────────────┘        │
│  ┌──────────────────────┐                                   │
│  │ DeFi Protocol        │                                   │
│  │ - Aave, SaucerSwap   │                                   │
│  │ - Yield generation   │                                   │
│  └──────────────────────┘                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 📅 Week-by-Week Implementation Plan

### **Week 1: Smart Contract Layer**

#### Goals
- Deploy AgentTrigger.sol
- Update ProposalFutarchy.sol
- Create Hedera DeFi Vincent abilities

#### Tasks

**Day 1-2: AgentTrigger.sol**
```solidity
// contract/contracts/AgentTrigger.sol
contract AgentTrigger {
    struct AgentInfo {
        address agentAddress;
        string vincentAppId;
        uint256 version;
        bool active;
    }
    
    mapping(uint256 => AgentInfo) public proposalAgents;
    mapping(uint256 => YieldReport) public yieldReports;
    
    event AgentRegistered(uint256 indexed proposalId, address agent);
    event YieldReported(uint256 indexed proposalId, uint256 actualAPR);
    
    function registerAgent(uint256 proposalId, address agent, string calldata appId) external;
    function reportYield(uint256 proposalId, uint256 actualAPR, bytes calldata proof) external;
    function deactivateAgent(uint256 proposalId) external;
}
```

**Deployment:**
```bash
npx hardhat run scripts/deploy-agent-trigger.ts --network hedera
npx hardhat hashscan-verify <ADDRESS> --contract contracts/AgentTrigger.sol:AgentTrigger --network hedera
```

**Day 3-4: Update ProposalFutarchy.sol**
```solidity
// Add to ProposalFutarchy.sol
function setAgentTrigger(address _agentTrigger) external onlyOwner;

function updateYield(
    uint256 proposalId,
    uint256 actualAPR,
    bytes calldata pythProof
) external onlyAgentTrigger {
    // Verify Pyth oracle proof
    // Store actualAPR
    // Update proposal status
}
```

**Upgrade contract:**
```bash
# Deploy new version
npx hardhat run scripts/upgrade-futarchy.ts --network hedera

# Or if not upgradeable, deploy fresh and migrate data
npx hardhat run scripts/migrate-proposals.ts --network hedera
```

**Day 5-7: Custom Vincent Abilities**

Create abilities for Hedera DeFi protocols:

1. **Aave/Compound Lending Ability**
```typescript
// packages/vincent-ability-hedera-lending/src/index.ts
export const hederaLendingAbility = {
  name: '@slime/vincent-ability-hedera-lending',
  version: '1.0.0',
  
  async precheck(params, context) {
    // Check balance
    // Check allowance
    // Verify pool exists
    return { success: true };
  },
  
  async execute(params, context) {
    // Approve PYUSD
    // Deposit to lending pool
    // Return receipt tokens
  }
};
```

2. **SaucerSwap LP Ability**
```typescript
// packages/vincent-ability-saucerswap-lp/src/index.ts
export const saucerSwapAbility = {
  name: '@slime/vincent-ability-saucerswap-lp',
  version: '1.0.0',
  
  async execute(params, context) {
    // Add liquidity to PYUSD/HBAR pool
    // Return LP tokens
  }
};
```

**Testing abilities:**
```bash
cd packages/vincent-ability-hedera-lending
npm test
npm run build
```

#### Deliverables
- [ ] AgentTrigger.sol deployed & verified on Hedera
- [ ] ProposalFutarchy.sol updated with reporting
- [ ] 2+ custom Vincent abilities created & tested
- [ ] All contracts verified on HashScan

---

### **Week 2: Backend Event Listener & Jobs**

#### Goals
- Set up event listener for MarketResolved
- Build strategy execution logic
- Create job scheduler infrastructure

#### Tasks

**Day 1-2: Project Setup**
```bash
# Fork Vincent DCA starter pack
git clone https://github.com/LIT-Protocol/vincent-dca.git futarchy-backend
cd futarchy-backend

# Install dependencies
pnpm install

# Add new packages
pnpm add ethers@5.8.0 @pythnetwork/pyth-evm-js
```

**Project structure:**
```
packages/futarchy-backend/
├── src/
│   ├── listeners/
│   │   └── futarchyListener.ts       # NEW
│   ├── jobs/
│   │   ├── executeYieldStrategy.ts   # NEW
│   │   ├── harvestYield.ts           # NEW
│   │   └── reportResults.ts          # NEW
│   ├── abilities/
│   │   ├── hederaLending.ts          # NEW
│   │   └── saucerSwapLP.ts           # NEW
│   ├── models/
│   │   ├── Proposal.ts               # NEW
│   │   ├── Position.ts               # NEW
│   │   └── Strategy.ts               # NEW
│   └── lib/
│       ├── contracts.ts              # Contract ABIs
│       └── pyth.ts                   # Pyth oracle client
```

**Day 3-4: Event Listener**
```typescript
// src/listeners/futarchyListener.ts
import { ethers } from 'ethers';
import { agenda } from '../lib/agenda';

export function setupFutarchyListener() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HEDERA_RPC_URL
  );
  
  const futarchy = new ethers.Contract(
    process.env.FUTARCHY_ADDRESS,
    FUTARCHY_ABI,
    provider
  );
  
  console.log('🎯 Starting Futarchy event listener...');
  
  // Listen for MarketResolved events
  futarchy.on('MarketResolved', async (proposalId, outcome) => {
    console.log(`📢 Market ${proposalId} resolved: ${outcome}`);
    
    try {
      if (outcome === 1) { // Outcome.Yes
        await handleMarketResolution(proposalId);
      }
    } catch (error) {
      console.error(`❌ Error handling resolution:`, error);
      Sentry.captureException(error);
    }
  });
  
  // Health check
  setInterval(async () => {
    const blockNumber = await provider.getBlockNumber();
    console.log(`💓 Listener alive - Block: ${blockNumber}`);
  }, 60000);
}

async function handleMarketResolution(proposalId: number) {
  // Get all positions that funded this proposal
  const positions = await Position.find({
    proposalId,
    fundingAmount: { $gt: 0 }
  });
  
  console.log(`📋 Found ${positions.length} positions to execute`);
  
  for (const position of positions) {
    // Queue strategy execution job
    await agenda.now('executeYieldStrategy', {
      proposalId,
      positionId: position._id.toString(),
      pkpInfo: position.pkpInfo,
      amount: position.fundingAmount,
      strategyType: position.strategyType
    });
  }
}
```

**Day 5-7: Job Definitions**
```typescript
// src/jobs/executeYieldStrategy.ts
import { Job } from '@whisthub/agenda';
import { getVincentAbilityClient } from '@lit-protocol/vincent-app-sdk/abilityClient';

export async function executeYieldStrategy(job: Job) {
  const { proposalId, positionId, pkpInfo, amount, strategyType } = job.attrs.data;
  
  console.log(`🚀 Executing ${strategyType} for ${amount} PYUSD`);
  
  // 1. Verify permissions
  const permitted = await getUserPermittedVersion({
    ethAddress: pkpInfo.ethAddress,
    appId: process.env.VINCENT_APP_ID
  });
  
  if (!permitted) {
    throw new Error('User revoked Vincent permissions');
  }
  
  // 2. Get ability client
  const abilityClient = getAbilityForStrategy(strategyType);
  
  // 3. Precheck
  const precheck = await abilityClient.precheck({
    tokenAddress: PYUSD_ADDRESS,
    amount: amount.toString(),
    // ... strategy-specific params
  }, {
    delegatorPkpEthAddress: pkpInfo.ethAddress
  });
  
  if (!precheck.success) {
    throw new Error(`Precheck failed: ${precheck.error}`);
  }
  
  // 4. Execute
  const result = await abilityClient.execute({
    tokenAddress: PYUSD_ADDRESS,
    amount: amount.toString(),
  }, {
    delegatorPkpEthAddress: pkpInfo.ethAddress
  });
  
  // 5. Store result
  await Strategy.create({
    proposalId,
    positionId,
    strategyType,
    depositAmount: amount,
    depositTxHash: result.result.txHash,
    receiptTokens: result.result.receiptTokens,
    status: 'deposited'
  });
  
  // 6. Schedule harvest (30 days later)
  const harvestDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await agenda.schedule(harvestDate, 'harvestYield', {
    proposalId,
    positionId
  });
  
  console.log(`✅ Strategy executed, harvest scheduled for ${harvestDate}`);
}
```

**Environment Setup:**
```bash
# .env
HEDERA_RPC_URL=https://testnet.hashio.io/api
FUTARCHY_ADDRESS=0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6
AGENT_TRIGGER_ADDRESS=<deployed_address>
PYUSD_ADDRESS=0x6a87032589b837935b1a393dc905c84e908c6974
VINCENT_APP_ID=<your_vincent_app_id>
VINCENT_DELEGATEE_PRIVATE_KEY=<your_private_key>
MONGODB_URI=mongodb://localhost:27017/futarchy
```

**Start backend:**
```bash
pnpm dev
```

#### Deliverables
- [ ] Event listener running and catching MarketResolved events
- [ ] executeYieldStrategy job working
- [ ] MongoDB storing strategy records
- [ ] Logs showing event → execution flow

---

### **Week 3: Harvest & Reporting**

#### Goals
- Build yield harvesting system
- Integrate Pyth oracle
- Report results on-chain

#### Tasks

**Day 1-3: Harvest Job**
```typescript
// src/jobs/harvestYield.ts
export async function harvestYield(job: Job) {
  const { proposalId, positionId } = job.attrs.data;
  
  console.log(`🌾 Harvesting yield for proposal ${proposalId}`);
  
  // 1. Get strategy
  const strategy = await Strategy.findOne({ proposalId, positionId });
  
  // 2. Withdraw from DeFi protocol
  const withdrawResult = await withdrawFromProtocol(
    strategy.pkpAddress,
    strategy.strategyType,
    strategy.receiptTokens
  );
  
  // 3. Calculate actual APR
  const principal = strategy.depositAmount;
  const returned = withdrawResult.amountWithdrawn;
  const yield = returned - principal;
  const days = 30;
  const actualAPR = (yield / principal) * (365 / days) * 100;
  
  console.log(`💰 Harvested: ${returned} PYUSD (${actualAPR.toFixed(2)}% APR)`);
  
  // 4. Update strategy record
  strategy.status = 'harvested';
  strategy.yieldGenerated = yield;
  strategy.actualAPR = actualAPR;
  await strategy.save();
  
  // 5. Queue reporting job
  await agenda.now('reportResults', {
    proposalId,
    actualAPR
  });
}
```

**Day 4-5: Pyth Oracle Integration**
```typescript
// src/lib/pyth.ts
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';

const pythConnection = new EvmPriceServiceConnection(
  'https://hermes.pyth.network'
);

export async function getPythProof(actualAPR: number) {
  // In production, you'd use a real price feed
  // For now, create a signed message
  
  const priceIds = [
    // PYUSD/USD price feed ID
    '0x...' 
  ];
  
  const priceUpdateData = await pythConnection.getPriceFeedsUpdateData(
    priceIds
  );
  
  return priceUpdateData[0];
}
```

**Day 6-7: Report to Contract**
```typescript
// src/jobs/reportResults.ts
export async function reportResults(job: Job) {
  const { proposalId, actualAPR } = job.attrs.data;
  
  console.log(`📊 Reporting ${actualAPR}% APR for proposal ${proposalId}`);
  
  // 1. Get Pyth proof
  const pythProof = await getPythProof(actualAPR);
  
  // 2. Call AgentTrigger contract
  const agentTrigger = new ethers.Contract(
    process.env.AGENT_TRIGGER_ADDRESS,
    AGENT_TRIGGER_ABI,
    delegateeSigner
  );
  
  const tx = await agentTrigger.reportYield(
    proposalId,
    Math.floor(actualAPR * 100), // Convert to basis points
    pythProof
  );
  
  await tx.wait();
  
  console.log(`✅ Results reported: ${tx.hash}`);
  
  // 3. Update all strategies for this proposal
  await Strategy.updateMany(
    { proposalId },
    { 
      reportedToChain: true,
      reportTxHash: tx.hash
    }
  );
}
```

**Testing:**
```bash
# Manually trigger harvest for testing
npx hardhat run scripts/test-harvest.ts --network hedera
```

#### Deliverables
- [ ] Harvest job withdraws from DeFi protocols
- [ ] Actual APR calculated correctly
- [ ] Pyth oracle integrated
- [ ] Results reported on-chain successfully
- [ ] End-to-end flow tested (propose → fund → resolve → execute → harvest → report)

---

### **Week 4: Frontend Integration**

#### Goals
- Build user interface for proposals
- Add Vincent authentication
- Show agent execution status

#### Tasks

**Day 1-2: Project Setup**
```bash
# Create Next.js app
npx create-next-app@latest futarchy-frontend
cd futarchy-frontend

# Install dependencies
npm install @lit-protocol/vincent-app-sdk ethers@5.8.0
npm install @radix-ui/react-dialog @radix-ui/react-tabs
npm install tailwindcss
```

**Day 3-4: Vincent Authentication**
```tsx
// src/components/ConnectVincent.tsx
import { useJwtContext, useVincentWebAuthClient } from '@lit-protocol/vincent-app-sdk/react';

export function ConnectVincent() {
  const { authInfo } = useJwtContext();
  const vincentClient = useVincentWebAuthClient(process.env.NEXT_PUBLIC_VINCENT_APP_ID);
  
  const connect = () => {
    vincentClient.redirectToConnectPage({
      redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI
    });
  };
  
  if (authInfo) {
    return (
      <div className="flex items-center gap-2">
        <span>✅ Connected</span>
        <span className="text-sm">{authInfo.pkp.ethAddress.slice(0, 6)}...</span>
      </div>
    );
  }
  
  return (
    <button 
      onClick={connect}
      className="btn-primary"
    >
      Connect Vincent Agent
    </button>
  );
}
```

**Day 5-6: Proposals Page**
```tsx
// src/app/proposals/page.tsx
'use client';

import { useProposals } from '@/hooks/useProposals';
import { ProposalCard } from '@/components/ProposalCard';

export default function ProposalsPage() {
  const { proposals, loading } = useProposals();
  
  if (loading) return <div>Loading proposals...</div>;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Active Proposals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map(proposal => (
          <ProposalCard 
            key={proposal.id}
            proposal={proposal}
          />
        ))}
      </div>
    </div>
  );
}
```

**Day 7: Funding Interface**
```tsx
// src/components/FundingModal.tsx
export function FundingModal({ proposal, isOpen, onClose }) {
  const [fundAmount, setFundAmount] = useState('');
  const [betSide, setBetSide] = useState<'yes' | 'no'>('yes');
  const [betAmount, setBetAmount] = useState('');
  
  const handleFund = async () => {
    // 1. Approve PYUSD
    await pyusdContract.approve(
      proposal.contractAddress,
      ethers.utils.parseUnits(fundAmount, 6)
    );
    
    // 2. Add funding
    await futarchyContract.addFunding(
      proposal.id,
      ethers.utils.parseUnits(fundAmount, 6)
    );
    
    // 3. Buy shares
    await futarchyContract.buyShares(
      proposal.id,
      betSide === 'yes',
      ethers.utils.parseUnits(betAmount, 6)
    );
    
    toast.success('Successfully funded proposal!');
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{proposal.strategyName}</DialogTitle>
          <DialogDescription>
            Target APR: {proposal.targetAPR}%
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label>Funding Amount (PYUSD)</label>
            <input 
              type="number"
              value={fundAmount}
              onChange={e => setFundAmount(e.target.value)}
              placeholder="100"
            />
          </div>
          
          <div>
            <label>Your Prediction</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setBetSide('yes')}
                className={betSide === 'yes' ? 'btn-yes active' : 'btn-yes'}
              >
                YES - Will succeed
              </button>
              <button 
                onClick={() => setBetSide('no')}
                className={betSide === 'no' ? 'btn-no active' : 'btn-no'}
              >
                NO - Will fail
              </button>
            </div>
          </div>
          
          <div>
            <label>Bet Amount (PYUSD)</label>
            <input 
              type="number"
              value={betAmount}
              onChange={e => setBetAmount(e.target.value)}
              placeholder="10"
            />
          </div>
          
          <button 
            onClick={handleFund}
            className="btn-primary w-full"
          >
            Fund & Bet
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### Deliverables
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Vincent authentication working
- [ ] Users can browse proposals
- [ ] Users can fund + bet
- [ ] Agent execution status visible

---

### **Week 5: Testing & Deployment**

#### Goals
- End-to-end testing
- Security review
- Mainnet deployment

#### Tasks

**Day 1-2: Integration Testing**

Test scenarios:
1. **Happy Path**
   ```
   User connects → Funds proposal → Market resolves YES →
   Agent executes → Harvest after 30d → Report results →
   User claims winnings
   ```

2. **User Revokes Permission**
   ```
   User funds → Revokes Vincent → Market resolves →
   Agent execution fails gracefully
   ```

3. **Strategy Fails**
   ```
   Market resolves → Agent executes → DeFi protocol fails →
   Proper error handling & notification
   ```

4. **Multiple Users Same Proposal**
   ```
   10 users fund → Market resolves → All strategies execute →
   All yields harvested → All results reported
   ```

**Day 3-4: Security Review**

Checklist:
- [ ] Contract access controls verified
- [ ] PKP permissions properly checked
- [ ] No private key exposure
- [ ] Rate limiting on API endpoints
- [ ] Event listener restart resilience
- [ ] Database backup configured
- [ ] Sentry error tracking setup

**Day 5: Mainnet Deployment**

```bash
# 1. Deploy contracts
npx hardhat run scripts/deploy-mainnet.ts --network hedera-mainnet

# 2. Verify contracts
npx hardhat hashscan-verify <ADDRESS> --network hedera-mainnet

# 3. Deploy backend
# Railway/Heroku deployment
railway up

# 4. Deploy frontend
vercel --prod

# 5. Update Vincent App
# Go to dashboard.heyvincent.ai
# Update production URLs
```

**Day 6-7: Documentation & Launch**

Create docs:
- User guide (how to connect Vincent, fund proposals)
- Developer docs (contract addresses, ABIs, API endpoints)
- Troubleshooting guide
- Video demo

#### Deliverables
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Mainnet contracts deployed & verified
- [ ] Backend deployed to production
- [ ] Frontend live with custom domain
- [ ] Documentation published
- [ ] Launch announcement ready

---

## 📦 Repository Structure

```
slime/
├── contract/                           # Smart contracts
│   ├── contracts/
│   │   ├── ProposalFutarchy.sol       # ✅ Existing (update)
│   │   ├── AgentTrigger.sol           # ➕ NEW
│   │   ├── PYUSDAdapter.sol           # ✅ Existing
│   │   └── PYUSDOFT.sol               # ✅ Existing
│   ├── scripts/
│   │   ├── deploy-agent-trigger.ts    # ➕ NEW
│   │   ├── upgrade-futarchy.ts        # ➕ NEW
│   │   └── test-harvest.ts            # ➕ NEW
│   └── test/
│       └── AgentTrigger.test.ts       # ➕ NEW
│
├── packages/
│   ├── vincent-ability-hedera-lending/  # ➕ NEW
│   │   ├── src/index.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── vincent-ability-saucerswap-lp/   # ➕ NEW
│   │   ├── src/index.ts
│   │   ├── test/
│   │   └── package.json
│   │
│   ├── futarchy-backend/               # ➕ NEW (based on dca-backend)
│   │   ├── src/
│   │   │   ├── bin/
│   │   │   │   ├── apiServer.ts
│   │   │   │   └── worker.ts
│   │   │   ├── listeners/
│   │   │   │   └── futarchyListener.ts
│   │   │   ├── jobs/
│   │   │   │   ├── executeYieldStrategy.ts
│   │   │   │   ├── harvestYield.ts
│   │   │   │   └── reportResults.ts
│   │   │   ├── models/
│   │   │   │   ├── Proposal.ts
│   │   │   │   ├── Position.ts
│   │   │   │   └── Strategy.ts
│   │   │   └── lib/
│   │   │       ├── contracts.ts
│   │   │       └── pyth.ts
│   │   ├── .env.example
│   │   └── package.json
│   │
│   └── futarchy-frontend/              # ➕ NEW
│       ├── src/
│       │   ├── app/
│       │   │   ├── proposals/
│       │   │   ├── positions/
│       │   │   └── layout.tsx
│       │   ├── components/
│       │   │   ├── ConnectVincent.tsx
│       │   │   ├── ProposalCard.tsx
│       │   │   ├── FundingModal.tsx
│       │   │   └── ExecutionStatus.tsx
│       │   ├── hooks/
│       │   │   ├── useVincent.ts
│       │   │   ├── useProposals.ts
│       │   │   └── useFutarchy.ts
│       │   └── lib/
│       │       └── contracts.ts
│       ├── .env.local.example
│       └── package.json
│
├── docs/
│   ├── INTEGRATION_GUIDE.md
│   ├── USER_GUIDE.md
│   ├── API.md
│   └── TROUBLESHOOTING.md
│
└── README.md
```

---

## 🧪 Testing Strategy

### Unit Tests
```bash
# Smart contracts
cd contract
npx hardhat test

# Vincent abilities
cd packages/vincent-ability-hedera-lending
npm test

# Backend jobs
cd packages/futarchy-backend
npm test
```

### Integration Tests
```bash
# Full flow test
npm run test:integration

# Tests:
# 1. Create proposal
# 2. User connects Vincent
# 3. User funds proposal
# 4. Market resolves
# 5. Agent executes
# 6. Harvest yield
# 7. Report results
# 8. User claims
```

### Manual Testing Checklist
- [ ] Vincent connection works on frontend
- [ ] Proposals load correctly
- [ ] Funding transaction succeeds
- [ ] Market resolution emits event
- [ ] Backend catches event
- [ ] Strategy executes successfully
- [ ] MongoDB records created
- [ ] Harvest job runs after 30 days
- [ ] Results reported on-chain
- [ ] User can claim winnings

---

## ✅ Pre-Launch Checklist

### Smart Contracts
- [ ] AgentTrigger.sol deployed & verified
- [ ] ProposalFutarchy.sol updated & verified
- [ ] All contracts audited
- [ ] Testnet fully tested
- [ ] Mainnet deployed

### Backend
- [ ] Event listener production-ready
- [ ] All jobs tested
- [ ] Database configured with backups
- [ ] Monitoring setup (Sentry, DataDog)
- [ ] API rate limiting enabled
- [ ] SSL certificates configured

### Frontend
- [ ] Vincent authentication working
- [ ] All user flows tested
- [ ] Mobile responsive
- [ ] SEO optimized
- [ ] Analytics integrated
- [ ] Custom domain configured

### Operations
- [ ] Runbook created
- [ ] On-call rotation setup
- [ ] Incident response plan
- [ ] Backup/restore tested
- [ ] Documentation complete
- [ ] User support ready

---

**Let's build the future of autonomous DeFi! 🚀**