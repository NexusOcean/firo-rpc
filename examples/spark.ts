/**
 * Spark Overview
 *
 * Summarize wallet-level Spark activity: balance, addresses, recent mints,
 * and basic network-level Spark stats.
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

async function sparkOverview() {
  const [balance, addresses, defaultAddress, mints, latestCoinId] =
    await Promise.all([
      client.getSparkBalance(),
      client.getAllSparkAddresses(),
      client.getSparkDefaultAddress(),
      client.listSparkMints(),
      client.getSparkLatestCoinId(),
    ]);

  const meta = await client.getSparkAnonymitySetMeta(latestCoinId);

  console.log(`Default address:  ${defaultAddress[0] ?? '(none)'}`);
  console.log(`Total addresses:  ${Object.keys(addresses).length}`);
  console.log(`Available:        ${balance.availableBalance} FIRO`);
  console.log(`Unconfirmed:      ${balance.unconfirmedBalance} FIRO`);
  console.log(`Full:             ${balance.fullBalance} FIRO`);
  console.log(`\nRecent mints (${mints.length}):`);

  for (const mint of mints.slice(0, 5)) {
    console.log(
      `  ${mint.txid.slice(0, 16)}... amount: ${mint.amount} used: ${mint.isUsed}`,
    );
  }
  console.log(`\nLatest coin group: ${latestCoinId}`);
  console.log(`Anonymity set size: ${meta.size}`);
}
sparkOverview().catch(console.error);
