// Contract Addresses on Hedera Testnet
export const ADDRESSES = {
  FUTARCHY: '0xbe6cb70Ce7C6A300E45c5B6ECA2Ee73cb2b74902',
  AGENT_TRIGGER: '0x081dEd6F31eBeC1F2eCEdDE5d97384f66148be21',
  HBARX: '0x25e1f00FEcf777cc2d9246Ccad0C28936C0DEdDb',
  PYUSD: '0x6a87032589b837935b1a393dc905c84e908c6974',
  BACKEND_WALLET: '0xd6499417BbC291304fc16f6849A1717D45569494',
} as const;

// ProposalFutarchy ABI
export const FUTARCHY_ABI = [
  'function createProposal(string strategyName, uint256 targetAPR, uint256 fundingGoal, uint256 duration) external returns (uint256)',
  'function buyShares(uint256 proposalId, bool isYes, uint256 amount) external',
  'function fundStrategy(uint256 proposalId, uint256 amount) external',
  'function resolveMarket(uint256 proposalId) external',
  'function claimWinnings(uint256 proposalId) external',
  'function getProposal(uint256 id) external view returns (tuple(uint256 id, address creator, string strategyName, uint256 targetAPR, uint256 fundingGoal, uint256 fundingRaised, uint256 deadline, uint8 status, uint8 outcome))',
  'function getMarket(uint256 id) external view returns (tuple(uint256 yesPool, uint256 noPool, uint256 totalYesShares, uint256 totalNoShares))',
  'function getUserPosition(uint256 proposalId, address user) external view returns (tuple(uint256 yesShares, uint256 noShares, uint256 fundingContributed, bool claimed))',
  'event ProposalCreated(uint256 indexed proposalId, address indexed creator, string strategyName, uint256 targetAPR)',
  'event SharesPurchased(uint256 indexed proposalId, address indexed buyer, bool isYes, uint256 amount, uint256 shares)',
  'event StrategyFunded(uint256 indexed proposalId, address indexed funder, uint256 amount)',
  'event MarketResolved(uint256 indexed proposalId, uint8 outcome)',
] as const;

// AgentTrigger ABI
export const AGENT_TRIGGER_ABI = [
  'function registerAgent(uint256 proposalId, address agent, string appId) external',
  'function reportYield(uint256 proposalId, uint256 actualAPR, bytes proof) external',
  'function deactivateAgent(uint256 proposalId) external',
  'function getAgentInfo(uint256 proposalId) external view returns (tuple(address agentAddress, string appId, bool isActive, uint256 reportedAPR))',
  'event AgentRegistered(uint256 indexed proposalId, address indexed agent, string appId)',
  'event YieldReported(uint256 indexed proposalId, uint256 actualAPR)',
] as const;

// PYUSD (PayPal USD) ABI
export const PYUSD_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
] as const;

// HBARX (Liquid Staking Token) ABI
export const HBARX_ABI = [
  'function stake() external payable returns (uint256)',
  'function unstake(uint256 hbarxAmount) external returns (uint256)',
  'function addRewards() external payable',
  'function balanceOf(address account) external view returns (uint256)',
  'function getCurrentAPR() external view returns (uint256)',
  'function exchangeRate() external view returns (uint256)',
  'function totalStaked() external view returns (uint256)',
  'event Staked(address indexed user, uint256 hbarAmount, uint256 hbarxAmount)',
  'event Unstaked(address indexed user, uint256 hbarxAmount, uint256 hbarAmount)',
] as const;

// Hedera Testnet Chain Config
export const HEDERA_TESTNET = {
  id: 296,
  name: 'Hedera Testnet',
  network: 'hedera-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: { http: ['https://testnet.hashio.io/api'] },
    public: { http: ['https://testnet.hashio.io/api'] },
  },
  blockExplorers: {
    default: { 
      name: 'HashScan', 
      url: 'https://hashscan.io/testnet' 
    },
  },
  testnet: true,
} as const;

// Token Decimals
export const DECIMALS = {
  PYUSD: 6,
  HBARX: 8,
  HBAR: 18,
} as const;

// Helper to format token amounts
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = amount / divisor;
  const fractionalPart = amount % divisor;
  
  if (fractionalPart === 0n) {
    return integerPart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  return `${integerPart}.${fractionalStr}`;
}

// Helper to parse token amounts
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [integer, fractional = ''] = amount.split('.');
  const paddedFractional = fractional.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(integer + paddedFractional);
}