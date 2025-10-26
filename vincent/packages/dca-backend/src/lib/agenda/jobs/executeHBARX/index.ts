import { executeHBARX } from './executeHBARX';

import type { JobParams } from './executeHBARX';

export const jobName = 'execute-hbarx';
export const processJob = executeHBARX;
export type { JobParams };