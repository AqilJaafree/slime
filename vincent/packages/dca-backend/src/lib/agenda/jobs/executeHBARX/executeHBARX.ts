import consola from 'consola';
import { ethers } from 'ethers';
import type { Scope } from '@sentry/node';
import type { Job } from '@whisthub/agenda';

const logger = consola.withTag('executeHBARX');


// Job parameters
export interface JobParams {
  proposalId: number;
  strategyName: string;
  targetAPR: number;
  fundingAmount: string; // PYUSD amount in wei (6 decimals)
  futarchyAddress: string;
  agentTriggerAddress: string;
  hbarxAddress: string;
  pyusdAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

// Contract ABIs
const HBARX_ABI = [
  'function stake() payable returns (uint256)',
  'function unstake(uint256 hbarxAmount) returns (uint256)',
  'function addRewards() payable',
  'function balanceOf(address) view returns (uint256)',
  'function getCurrentAPR() view returns (uint256)',
  'function exchangeRate() view returns (uint256)',
  'function previewStake(uint256) view returns (uint256)',
  'function previewUnstake(uint256) view returns (uint256)',
];

const AGENT_TRIGGER_ABI = [
  'function reportYield(uint256 proposalId, uint256 actualAPR, bytes proof)',
];

const PYUSD_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function approve(address, uint256) returns (bool)',
  'function transfer(address, uint256) returns (bool)',
];

/**
 * Execute HBARX liquid staking strategy
 */
export async function executeHBARX(job: Job<JobParams>, scope: Scope) {
  const {
    proposalId,
    strategyName,
    targetAPR,
    fundingAmount,
    hbarxAddress,
    agentTriggerAddress,
    pyusdAddress,
  } = job.attrs.data;

  logger.info(`\n${'='.repeat(60)}`);
  logger.info(`🚀 Executing HBARX Strategy - Proposal ${proposalId}`);
  logger.info(`${'='.repeat(60)}\n`);

  logger.info(`📋 Strategy Details:`);
  logger.info(`   Name: ${strategyName}`);
  logger.info(`   Target APR: ${targetAPR / 100}%`);
  logger.info(`   Funding: ${ethers.utils.formatUnits(fundingAmount, 6)} PYUSD\n`);

  scope.setContext('hbarx-job', {
    proposalId,
    strategyName,
    targetAPR,
    fundingAmount,
  });

  try {
    // Setup contracts
    const rpcUrl = process.env.HEDERA_RPC_URL || 'https://testnet.hashio.io/api';
    const privateKey = process.env.VINCENT_DELEGATEE_PRIVATE_KEY!;

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    logger.info(`👤 Vincent Agent: ${signer.address}\n`);

    const hbarx = new ethers.Contract(hbarxAddress, HBARX_ABI, signer);
    const agentTrigger = new ethers.Contract(agentTriggerAddress, AGENT_TRIGGER_ABI, signer);
    const pyusd = new ethers.Contract(pyusdAddress, PYUSD_ABI, signer);

    // STEP 1: Swap PYUSD → HBAR
    logger.info('🔄 STEP 1: Swap PYUSD → HBAR');
    const hbarAmount = await swapPYUSDtoHBAR(fundingAmount, pyusd, signer);
    logger.info(`   ✅ Swapped to ${ethers.utils.formatEther(hbarAmount)} HBAR\n`);

    // STEP 2: Stake HBAR → HBARX
    logger.info('🔄 STEP 2: Stake HBAR → HBARX');
    const hbarxBalance = await stakeHBAR(hbarAmount, hbarx, signer);
    logger.info(`   ✅ Received ${ethers.utils.formatEther(hbarxBalance)} HBARX\n`);

    // STEP 3: Simulate staking period & rewards
    logger.info('⏰ STEP 3: Simulate staking period (30 days)');
    const rewardsAmount = await simulateStaking(hbarAmount, targetAPR);
    logger.info(`   ✅ Expected rewards: ${ethers.utils.formatEther(rewardsAmount)} HBAR\n`);

    // STEP 4: Add rewards to HBARX
    logger.info('🔄 STEP 4: Add rewards to HBARX pool');
    const actualAPR = await addRewards(rewardsAmount, hbarx, signer);
    logger.info(`   ✅ Actual APR: ${actualAPR / 100}%\n`);

    // STEP 5: Unstake HBARX → HBAR
    logger.info('🔄 STEP 5: Unstake HBARX → HBAR');
    const finalHBAR = await unstakeHBARX(hbarxBalance, hbarx, signer);
    logger.info(`   ✅ Received ${ethers.utils.formatEther(finalHBAR)} HBAR\n`);

    // STEP 6: Swap HBAR → PYUSD
    logger.info('🔄 STEP 6: Swap HBAR → PYUSD');
    const finalPYUSD = await swapHBARtoPYUSD(finalHBAR, pyusd, signer);
    logger.info(`   ✅ Final: ${ethers.utils.formatUnits(finalPYUSD, 6)} PYUSD\n`);

    // STEP 7: Report yield
    logger.info('🔄 STEP 7: Report yield to AgentTrigger');
    await reportYield(proposalId, actualAPR, agentTrigger);
    logger.info(`   ✅ Yield reported!\n`);

    logger.box(`
🎉 HBARX Strategy Executed Successfully!

Proposal: ${proposalId}
Strategy: ${strategyName}
Target APR: ${targetAPR / 100}%
Actual APR: ${actualAPR / 100}%
Initial: ${ethers.utils.formatUnits(fundingAmount, 6)} PYUSD
Final: ${ethers.utils.formatUnits(finalPYUSD, 6)} PYUSD
Profit: ${ethers.utils.formatUnits(finalPYUSD.sub(fundingAmount), 6)} PYUSD
    `);

    logger.success(`✅ Job complete for Proposal ${proposalId}\n`);
  } catch (error: any) {
    logger.error(`❌ HBARX execution failed: ${error.message}`);
    scope.captureException(error);
    throw error;
  }
}

/**
 * Swap PYUSD to HBAR (simplified 1:1 for testnet)
 */
async function swapPYUSDtoHBAR(
  pyusdAmount: string,
  pyusd: ethers.Contract,
  signer: ethers.Wallet
): Promise<ethers.BigNumber> {
  logger.info(`   Swapping ${ethers.utils.formatUnits(pyusdAmount, 6)} PYUSD...`);

  // For testnet: Simulate 1:1 swap
  // In production: Use SaucerSwap or other DEX
  const hbarAmount = ethers.BigNumber.from(pyusdAmount);

  logger.info(`   (Testnet simulation: 1 PYUSD = 1 HBAR)`);

  return hbarAmount;
}

/**
 * Stake HBAR to get HBARX
 */
async function stakeHBAR(
  hbarAmount: ethers.BigNumber,
  hbarx: ethers.Contract,
  signer: ethers.Wallet
): Promise<ethers.BigNumber> {
  logger.info(`   Staking ${ethers.utils.formatEther(hbarAmount)} HBAR...`);

  // Preview how much HBARX we'll get
  const expectedHBARX = await hbarx.previewStake(hbarAmount);
  logger.info(`   Expected HBARX: ${ethers.utils.formatEther(expectedHBARX)}`);

  // Stake HBAR
  const tx = await hbarx.stake({ value: hbarAmount });
  const receipt = await tx.wait();

  logger.info(`   TX: https://hashscan.io/testnet/transaction/${tx.hash}`);

  // Check balance
  const hbarxBalance = await hbarx.balanceOf(signer.address);
  return hbarxBalance;
}

/**
 * Simulate 30-day staking period
 */
async function simulateStaking(
  hbarAmount: ethers.BigNumber,
  targetAPR: number
): Promise<ethers.BigNumber> {
  logger.info(`   Simulating 30 days of staking...`);
  logger.info(`   (For testnet demo - instant simulation)`);

  // Calculate 1 month of rewards at target APR
  // Monthly APR = Annual APR / 12
  const monthlyAPR = targetAPR / 12;
  const rewardsAmount = hbarAmount.mul(monthlyAPR).div(10000);

  logger.info(`   Monthly APR: ${monthlyAPR / 100}%`);

  return rewardsAmount;
}

/**
 * Add rewards to HBARX pool
 */
async function addRewards(
  rewardsAmount: ethers.BigNumber,
  hbarx: ethers.Contract,
  signer: ethers.Wallet
): Promise<number> {
  logger.info(`   Adding ${ethers.utils.formatEther(rewardsAmount)} HBAR rewards...`);

  // Add rewards (sends HBAR to contract)
  const tx = await hbarx.addRewards({ value: rewardsAmount });
  await tx.wait();

  logger.info(`   TX: https://hashscan.io/testnet/transaction/${tx.hash}`);

  // Get new exchange rate and APR
  const exchangeRate = await hbarx.exchangeRate();
  const actualAPR = await hbarx.getCurrentAPR();

  logger.info(`   New exchange rate: ${ethers.utils.formatEther(exchangeRate)}`);

  return actualAPR.toNumber();
}

/**
 * Unstake HBARX to get HBAR back
 */
async function unstakeHBARX(
  hbarxAmount: ethers.BigNumber,
  hbarx: ethers.Contract,
  signer: ethers.Wallet
): Promise<ethers.BigNumber> {
  logger.info(`   Unstaking ${ethers.utils.formatEther(hbarxAmount)} HBARX...`);

  // Preview how much HBAR we'll get
  const expectedHBAR = await hbarx.previewUnstake(hbarxAmount);
  logger.info(`   Expected HBAR: ${ethers.utils.formatEther(expectedHBAR)}`);

  // Get HBAR balance before
  const balanceBefore = await signer.getBalance();

  // Unstake
  const tx = await hbarx.unstake(hbarxAmount);
  const receipt = await tx.wait();

  logger.info(`   TX: https://hashscan.io/testnet/transaction/${tx.hash}`);

  // Get HBAR balance after
  const balanceAfter = await signer.getBalance();
  const hbarReceived = balanceAfter.sub(balanceBefore).add(receipt.gasUsed.mul(tx.gasPrice || 0));

  return hbarReceived;
}

/**
 * Swap HBAR back to PYUSD
 */
async function swapHBARtoPYUSD(
  hbarAmount: ethers.BigNumber,
  pyusd: ethers.Contract,
  signer: ethers.Wallet
): Promise<ethers.BigNumber> {
  logger.info(`   Swapping ${ethers.utils.formatEther(hbarAmount)} HBAR to PYUSD...`);

  // For testnet: Simulate 1:1 swap
  // In production: Use SaucerSwap or other DEX
  const pyusdAmount = hbarAmount;

  logger.info(`   (Testnet simulation: 1 HBAR = 1 PYUSD)`);

  return pyusdAmount;
}

/**
 * Report yield to AgentTrigger
 */
async function reportYield(
  proposalId: number,
  actualAPR: number,
  agentTrigger: ethers.Contract
): Promise<void> {
  logger.info(`   Reporting APR: ${actualAPR / 100}%`);

  const tx = await agentTrigger.reportYield(
    proposalId,
    actualAPR,
    '0x' // No proof needed for demo
  );
  await tx.wait();

  logger.info(`   TX: https://hashscan.io/testnet/transaction/${tx.hash}`);
}