/**
 * Encrypted Wallet
 *
 * Unlock an encrypted wallet, sign and verify a message, then lock it again.
 * Requires FIRO_WALLET_PASSPHRASE in .env.test. Does not send any funds.
 *
 */

import dotenv from 'dotenv';
import { createFiroRpcClient, RpcCallError } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });
const {
  FIRO_HOST,
  FIRO_USER,
  FIRO_PASS,
  FIRO_PORT,
  FIRO_PROTOCOL,
  FIRO_WALLET_PASSPHRASE,
} = parsed as Record<string, string>;

const client = createFiroRpcClient({
  host: FIRO_HOST,
  port: parseInt(FIRO_PORT, 10),
  user: FIRO_USER,
  pass: FIRO_PASS,
  protocol: FIRO_PROTOCOL as 'http' | 'https',
});

const WALLET_LOCKED = -13;

async function main() {
  if (!FIRO_WALLET_PASSPHRASE) {
    console.error('Set FIRO_WALLET_PASSPHRASE in .env.test');
    process.exit(1);
  }

  // unlocked_until is only present on encrypted wallets
  const info = await client.getWalletInfo();
  if (info.unlocked_until === undefined) {
    console.error('Wallet is not encrypted — nothing to unlock');
    process.exit(1);
  }

  const address = process.argv[2] ?? (await client.getRawChangeAddress());
  const message = `firo-rpc example ${new Date().toISOString()}`;

  // Signing fails while the wallet is locked
  try {
    await client.signMessage(address, message);
    console.log('Wallet was already unlocked');
  } catch (err) {
    if (!(err instanceof RpcCallError) || err.code !== WALLET_LOCKED) throw err;
    console.log(`Locked:    ${err.message}`);
  }

  // Unlock for 30 seconds, and always lock again when done
  await client.walletPassphrase(FIRO_WALLET_PASSPHRASE, 30);
  try {
    const { unlocked_until } = await client.getWalletInfo();
    console.log(
      `Unlocked until ${new Date(unlocked_until! * 1000).toISOString()}`,
    );

    const signature = await client.signMessage(address, message);
    const valid = await client.verifyMessage(address, signature, message);

    console.log(`Address:   ${address}`);
    console.log(`Message:   ${message}`);
    console.log(`Signature: ${signature}`);
    console.log(`Valid:     ${valid}`);
  } finally {
    await client.walletLock();
    console.log('Wallet locked');
  }
}

main().catch(console.error);
