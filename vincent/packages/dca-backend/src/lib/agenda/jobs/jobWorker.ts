import * as Sentry from '@sentry/node';
import consola from 'consola';
import type { Job } from '@whisthub/agenda';
import { createAgenda, getAgenda } from '../agendaClient';
import { executeHBARXJobDef } from '../jobs';



/**
 * Create and configure job worker with HBARX liquid staking
 */
export async function startWorker() {
  await createAgenda();

  const agenda = getAgenda();

  // ========================================
  // HBARX LIQUID STAKING JOB
  // ========================================
  agenda.define(
    executeHBARXJobDef.jobName,
    async (job: Job<executeHBARXJobDef.JobParams>) =>
      Sentry.withIsolationScope(async (scope) => {
        try {
          await executeHBARXJobDef.processJob(job, scope);
        } catch (err) {
          scope.captureException(err);
          const error = err as Error;

          consola.error(`❌ HBARX job failed: ${error.message}`);

          throw err;
        } finally {
          Sentry.flush(2000);
        }
      })
  );

  consola.success('✅ Job worker started - HBARX liquid staking ready');

  return agenda;
}