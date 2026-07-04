import dotenv from 'dotenv';
import { createFiroRpcClient } from '../src/index.js';
import type { FiroRpcClient } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });

const {
  FIRO_HOST,
  FIRO_USER,
  FIRO_PASS,
  FIRO_PORT,
  FIRO_PROTOCOL,
  FIRO_TEST_SEND,
  TEST_IMPORT_ADDRESS,
  TEST_ADDRESS,
  TEST_SPARK_ADDRESS,
  TEST_SPENT_TXID,
  TEST_SPENT_INDEX,
} = parsed as Record<string, string>;

if (!FIRO_HOST || !FIRO_USER || !FIRO_PASS || !FIRO_PORT || !FIRO_PROTOCOL) {
  throw new Error('Missing required FIRO_* env vars in .env.test');
}

export const config = {
  host: FIRO_HOST,
  port: parseInt(FIRO_PORT, 10),
  user: FIRO_USER,
  pass: FIRO_PASS,
  enableTor: false,
  protocol: FIRO_PROTOCOL as 'http' | 'https',
};

export function makeClient(
  overrides: Partial<typeof config> = {},
): FiroRpcClient {
  return createFiroRpcClient({ ...config, ...overrides });
}

export const shouldTestSend = FIRO_TEST_SEND === '1';

export const maybeDescribe = TEST_IMPORT_ADDRESS ? describe : describe.skip;

export const IMPORT_ADDRESS = TEST_IMPORT_ADDRESS ?? '';

export const maybeDescribeAddress = TEST_ADDRESS ? describe : describe.skip;

export const ADDRESS = TEST_ADDRESS ?? '';

export const maybeDescribeSparkAddress = TEST_SPARK_ADDRESS
  ? describe
  : describe.skip;

export const SPARK_ADDRESS = TEST_SPARK_ADDRESS ?? '';

export const maybeDescribeSpentInfo =
  TEST_SPENT_TXID && TEST_SPENT_INDEX ? describe : describe.skip;

export const SPENT_TXID = TEST_SPENT_TXID ?? '';

export const SPENT_INDEX = TEST_SPENT_INDEX
  ? parseInt(TEST_SPENT_INDEX, 10)
  : 0;
