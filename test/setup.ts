import dotenv from 'dotenv';
import { createFiroRpcClient } from '../src/index.js';
import type { FiroRpcClient } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });

const { FIRO_HOST, FIRO_USER, FIRO_PASS, FIRO_PORT, FIRO_PROTOCOL } = parsed as Record<
  string,
  string
>;

if (!FIRO_HOST || !FIRO_USER || !FIRO_PASS || !FIRO_PORT || !FIRO_PROTOCOL) {
  throw new Error('Missing required FIRO_* env vars in .env.test');
}

export const config = {
  host: FIRO_HOST,
  port: parseInt(FIRO_PORT, 10),
  user: FIRO_USER,
  pass: FIRO_PASS,
  protocol: FIRO_PROTOCOL as 'http' | 'https',
};

export function makeClient(overrides: Partial<typeof config> = {}): FiroRpcClient {
  return createFiroRpcClient({ ...config, ...overrides });
}
