/**
 * Wallet
 *
 * Look up balance and transaction history for a Firo address.
 * Requires -addressindex enabled on your node.
 *
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

async function main() {
  const address = process.argv[2];
  if (!address) {
    console.error('Usage: npx tsx examples/wallet.ts <address>');
    process.exit(1);
  }

  const [balance, txids] = await Promise.all([
    client.getAddressBalance(address),
    client.getAddressTxIds(address),
  ]);

  console.log(`Address:  ${address}`);
  console.log(`Balance:  ${balance.balance} FIRO`);
  console.log(`Received: ${balance.received} FIRO`);
  console.log(`TxIds (${txids.length} total):`, txids.slice(0, 5));
  if (txids.length > 5) console.log(`  ...and ${txids.length - 5} more`);
}

main().catch(console.error);
