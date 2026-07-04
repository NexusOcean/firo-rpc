import { makeClient } from './setup.js';

const client = makeClient();

let bestHash: string;

beforeAll(async () => {
  const blockCount = await client.getBlockCount();
  bestHash = await client.getBlockHash(blockCount);
});

describe('getRawTransaction', () => {
  it('returns a coinbase transaction with expected fields', async () => {
    const block = await client.getBlock(bestHash);
    const txid = block.tx[0]!.txid;
    const tx = await client.getRawTransaction(txid);
    expect(tx.txid).toBe(txid);
    expect(tx.type).toBe(5);
    expect(typeof tx.hex).toBe('string');
    expect(typeof tx.instantlock).toBe('boolean');
    expect(typeof tx.chainlock).toBe('boolean');
    expect(tx.cbTx).toBeDefined();
  });

  it('returns a standard transaction with vin address fields', async () => {
    const block = await client.getBlock(bestHash);
    const standardTx = block.tx.find((tx) => tx.type === 0);
    if (!standardTx) return;
    const tx = await client.getRawTransaction(standardTx.txid);
    expect(tx.type).toBe(0);
    const vin = tx.vin[0]! as { address?: string };
    expect(typeof vin.address).toBe('string');
  });

  it('returns hex string when verbose is false', async () => {
    const block = await client.getBlock(bestHash);
    const txid = block.tx[0]!.txid;
    const hex = await client.getRawTransaction(txid, false);
    expect(typeof hex).toBe('string');
    expect(hex).toMatch(/^[0-9a-f]+$/);
  });
});
