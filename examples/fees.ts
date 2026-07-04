/**
 * Fees
 *
 * Estimate transaction fees and fee rates for confirmation within
 * a target number of blocks.
 *
 */

import dotenv from 'dotenv';
import { createFiroRpcClient } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });
const { FIRO_HOST, FIRO_USER, FIRO_PASS, FIRO_PORT, FIRO_PROTOCOL } =
  parsed as Record<string, string>;

const client = createFiroRpcClient({
  host: FIRO_HOST,
  port: parseInt(FIRO_PORT, 10),
  user: FIRO_USER,
  pass: FIRO_PASS,
  protocol: FIRO_PROTOCOL as 'http' | 'https',
});

async function main(nblocks: number = 5) {
  const blocks = Math.round(nblocks);

  const [feeRate, estimatedFee, smartFee] = await Promise.all([
    client.getFeeRate(),
    client.estimateFee(blocks),
    client.estimateSmartFee(blocks),
  ]);

  console.log(`Target:        ${blocks} blocks`);
  console.log(`Fee rate:      ${JSON.stringify(feeRate)}`);
  console.log(`Estimated fee: ${estimatedFee} FIRO`);
  console.log(`Smart fee:     ${JSON.stringify(smartFee)}`);
}

main().catch(console.error);
