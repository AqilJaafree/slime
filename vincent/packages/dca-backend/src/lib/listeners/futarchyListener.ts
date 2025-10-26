import { ethers } from 'ethers';
import consola from 'consola';

const logger = consola.withTag('futarchy-listener');

// Contract ABIs
const FUTARCHY_ABI = [
  'event MarketResolved(uint256 indexed id, uint8 outcome)',
  'function getProposal(uint256 id) view returns (tuple(uint256 id, address creator, string strategyName, uint256 targetAPR, uint256 fundingGoal, uint256 deadline, uint8 status, uint256 actualAPR, bool yieldReported))',
  'function getMarket(uint256 id) view returns (tuple(uint256 yesShares, uint256 noShares, uint256 yesCollateral, uint256 noCollateral, uint256 totalFunding, uint8 outcome, bool resolved))',
];

export interface FutarchyListenerConfig {
  futarchyAddress: string;
  agentTriggerAddress: string;
  hbarxAddress: string;
  pyusdAddress: string;
  rpcUrl: string;
  onMarketResolved: (proposalId: number, market: any, proposal: any) => Promise<void>;
}

/**
 * Start listening for MarketResolved events from ProposalFutarchy
 */
export function startFutarchyListener(config: FutarchyListenerConfig) {
  const { futarchyAddress, rpcUrl, onMarketResolved } = config;

  logger.info('\n' + '='.repeat(60));
  logger.info('🎧 STARTING FUTARCHY EVENT LISTENER');
  logger.info('='.repeat(60) + '\n');

  logger.info('📋 Configuration:');
  logger.info(`   Futarchy: ${futarchyAddress}`);
  logger.info(`   HBARX: ${config.hbarxAddress}`);
  logger.info(`   RPC: ${rpcUrl}\n`);

  // Connect to Hedera
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const futarchy = new ethers.Contract(futarchyAddress, FUTARCHY_ABI, provider);

  // Listen for MarketResolved events
  futarchy.on(
    'MarketResolved',
    async (proposalId: ethers.BigNumber, outcome: number, event: any) => {
      try {
        logger.info('\n' + '='.repeat(60));
        logger.info(`📊 MARKET RESOLVED - Proposal ${proposalId.toString()}`);
        logger.info('='.repeat(60) + '\n');

        logger.info(`📋 Event Details:`);
        logger.info(`   Proposal ID: ${proposalId.toString()}`);
        logger.info(`   Outcome: ${outcome === 1 ? 'YES ✅' : outcome === 2 ? 'NO ❌' : 'UNDECIDED'}`);
        logger.info(`   Block: ${event.blockNumber}`);
        logger.info(`   TX: https://hashscan.io/testnet/transaction/${event.transactionHash}\n`);

        // Only execute on YES outcome
        if (outcome !== 1) {
          logger.info('   ⏭️  Outcome is NO - skipping execution\n');
          return;
        }

        logger.info('   ✅ Outcome is YES - proceeding with execution\n');

        // Fetch proposal details
        logger.info('🔍 Fetching proposal details...');
        const proposal = await futarchy.getProposal(proposalId);
        const market = await futarchy.getMarket(proposalId);

        logger.info(`\n📋 Proposal Details:`);
        logger.info(`   Strategy: ${proposal.strategyName}`);
        logger.info(`   Target APR: ${proposal.targetAPR / 100}%`);
        logger.info(`   Funding Goal: ${ethers.utils.formatUnits(proposal.fundingGoal, 6)} PYUSD`);
        logger.info(`   Deadline: ${new Date(proposal.deadline * 1000).toISOString()}\n`);

        logger.info(`📊 Market Details:`);
        logger.info(`   Total Funding: ${ethers.utils.formatUnits(market.totalFunding, 6)} PYUSD`);
        logger.info(`   YES Shares: ${ethers.utils.formatUnits(market.yesShares, 6)}`);
        logger.info(`   NO Shares: ${ethers.utils.formatUnits(market.noShares, 6)}\n`);

        // Check if funding goal met
        if (market.totalFunding.lt(proposal.fundingGoal)) {
          logger.warn('   ⚠️  Funding goal not met - skipping execution\n');
          return;
        }

        logger.info('✅ All checks passed - triggering HBARX strategy execution\n');

        // Trigger the callback to create Agenda job
        await onMarketResolved(proposalId.toNumber(), market, proposal);

        logger.success(`✅ Strategy execution initiated for Proposal ${proposalId.toString()}\n`);
      } catch (error: any) {
        logger.error(`❌ Error handling MarketResolved event: ${error.message}`);
        console.error(error);
      }
    }
  );

  // Handle provider errors
  provider.on('error', (error) => {
    logger.error('❌ Provider error:', error);
  });

  // Reconnection logic
  provider.on('disconnect', () => {
    logger.warn('⚠️  Provider disconnected, attempting to reconnect...');
    setTimeout(() => startFutarchyListener(config), 5000);
  });

  logger.success('✅ Futarchy listener started successfully!\n');
  logger.info('👂 Listening for MarketResolved events...\n');

  return { futarchy, provider };
}

/**
 * Get past MarketResolved events (for backfilling)
 */
export async function getPastMarketResolvedEvents(
  futarchyAddress: string,
  rpcUrl: string,
  fromBlock: number = 0
): Promise<ethers.Event[]> {
  logger.info('📜 Fetching past MarketResolved events...');

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const futarchy = new ethers.Contract(futarchyAddress, FUTARCHY_ABI, provider);

  const filter = futarchy.filters.MarketResolved();
  const events = await futarchy.queryFilter(filter, fromBlock, 'latest');

  logger.info(`   Found ${events.length} past events\n`);

  return events;
}