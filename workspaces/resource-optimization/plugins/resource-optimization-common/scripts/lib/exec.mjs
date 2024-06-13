import { promisify } from 'node:util';
import { exec as execInternal } from 'node:child_process';

export const exec = promisify(execInternal);
