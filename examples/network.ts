/**
 * Network Dashboard
 *
 * Inspect node connectivity and peer health.
 * Useful for node monitoring tools, masternode dashboards, or network visualizers.
 */

import dotenv from 'dotenv';
import { createFiroRpcClient } from '../src/utils/client.js';

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

async function networkSummary() {
  const [networkInfo, peers, chainInfo] = await Promise.all([
    client.getNetworkInfo(),
    client.getPeerInfo(),
    client.getBlockchainInfo(),
  ]);

  console.log(`Node version:    ${networkInfo.subversion}`);
  console.log(`Protocol:        ${networkInfo.protocolversion}`);
  console.log(`Connections:     ${networkInfo.connections}`);
  console.log(`Chain:           ${chainInfo.chain}`);
  console.log(`Blocks:          ${chainInfo.blocks}`);
  console.log(
    `Verification:    ${(chainInfo.verificationprogress * 100).toFixed(2)}%`,
  );

  console.log(`\nPeers (${peers.length}):`);
  for (const peer of peers) {
    const direction = peer.inbound ? 'inbound ' : 'outbound';
    console.log(`  [${direction}] ${peer.addr} — version: ${peer.subver}`);
  }
}

networkSummary().catch(console.error);
