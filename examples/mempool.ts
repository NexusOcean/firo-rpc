/**
 * Mempool Monitor
 *
 * Poll the mempool for unconfirmed transactions.
 * Useful for real-time dashboards, fee estimators, or alert systems.
 */

import dotenv from 'dotenv';
import { createFiroRpcClient } from '../src/utils/client.js';

const { parsed } = dotenv.config({ path: '.env.test' });
const { FIRO_HOST, FIRO_USER, FIRO_PASS, FIRO_PORT, FIRO_PROTOCOL } = parsed as Record<
  string,
  string
>;

const client = createFiroRpcClient({
  host: FIRO_HOST,
  port: parseInt(FIRO_PORT, 10),
  user: FIRO_USER,
  pass: FIRO_PASS,
  protocol: FIRO_PROTOCOL as 'http' | 'https',
});

async function snapshot() {
  const info = await client.getMempoolInfo();
  const mempool = await client.getRawMempool();
  const txids = Object.keys(mempool);

  console.log(`Mempool: ${info.size} txs, ${(info.bytes / 1024).toFixed(1)} KB`);
  console.log(`Sample txids:`);
  for (const txid of txids.slice(0, 5)) {
    const entry = mempool[txid];
    console.log(`  ${txid.slice(0, 16)}... fee: ${entry.fee} time: ${entry.time}`);
  }
}

async function monitor(intervalMs = 30_000) {
  console.log(`Monitoring mempool every ${intervalMs / 1000}s...\n`);
  await snapshot();
  setInterval(snapshot, intervalMs);
}

monitor().catch(console.error);
