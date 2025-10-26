import consola from 'consola';
import { startWorker } from '../lib/jobWorker.js';
import { startFutarchyListener } from '../lib/listeners/futarchyListener.js';
import { getAgenda } from '../lib/agenda/agendaClient.js';
import { executeHBARXJobDef } from '../../src/lib/agenda/jobs/index.js';

/**
 * Start Vincent backend for Futarchy HBARX liquid staking
 */
async function main() {
  consola.info('\n' + '='.repeat(60));
  consola.info('🚀 STARTING FUTARCHY HBARX BACKEND');
  consola.info('='.repeat(60) + '\n');

  // Start job worker (HBARX only)
  await startWorker();
  
  const agenda = getAgenda();

  // Start Futarchy listener
  const futarchyConfig = {
    futarchyAddress: process.env.FUTARCHY_ADDRESS || '0xbe6cb70Ce7C6A300E45c5B6ECA2Ee73cb2b74902',
    agentTriggerAddress: process.env.AGENT_TRIGGER_ADDRESS || '0x081dEd6F31eBeC1F2eCEdDE5d97384f66148be21',
    hbarxAddress: process.env.HBARX_ADDRESS || '0x25e1f00FEcf777cc2d9246Ccad0C28936C0DEdDb',
    pyusdAddress: process.env.PYUSD_ADDRESS || '0x6a87032589b837935b1a393dc905c84e908c6974',
    rpcUrl: process.env.HEDERA_RPC_URL || 'https://testnet.hashio.io/api',
    
    // Callback when market resolves
    onMarketResolved: async (proposalId: number, market: any, proposal: any) => {
      consola.info(`\n📝 Creating HBARX liquid staking job for Proposal ${proposalId}`);

      // Create Agenda job for HBARX execution
      const job = agenda.create<executeHBARXJobDef.JobParams>(executeHBARXJobDef.jobName, {
        proposalId,
        strategyName: proposal.strategyName,
        targetAPR: proposal.targetAPR.toNumber(),
        fundingAmount: market.totalFunding.toString(),
        futarchyAddress: futarchyConfig.futarchyAddress,
        agentTriggerAddress: futarchyConfig.agentTriggerAddress,
        hbarxAddress: futarchyConfig.hbarxAddress,
        pyusdAddress: futarchyConfig.pyusdAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Execute immediately
      job.schedule('now');
      await job.save();

      consola.success(`✅ HBARX job created: ${job.attrs._id}\n`);
    },
  };

  startFutarchyListener(futarchyConfig);

  consola.success('\n✅ Futarchy HBARX backend initialized!');
  consola.info('   👂 Listening for market resolutions...');
  consola.info('   💧 Ready to execute liquid staking strategies\n');

  // Keep process alive
  process.on('SIGTERM', async () => {
    consola.info('SIGTERM received, shutting down gracefully...');
    await agenda.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    consola.info('SIGINT received, shutting down gracefully...');
    await agenda.stop();
    process.exit(0);
  });
}

main().catch((error) => {
  consola.error('Failed to start Futarchy backend:', error);
  process.exit(1);
});