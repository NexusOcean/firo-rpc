import { makeClient } from './setup.js';

const client = makeClient();

let blockCount: number;
let bestHash: string;

beforeAll(async () => {
  blockCount = await client.getBlockCount();
  bestHash = await client.getBlockHash(blockCount);
});

describe('getBlockCount', () => {
  it('returns a positive number', async () => {
    const count = await client.getBlockCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThan(0);
  });
});

describe('getBlockHash', () => {
  it('returns a 64-char hex string', async () => {
    const hash = await client.getBlockHash(blockCount);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('getBlock', () => {
  it('returns a block with expected fields', async () => {
    const block = await client.getBlock(bestHash);
    expect(block.hash).toBe(bestHash);
    expect(block.height).toBe(blockCount);
    expect(typeof block.difficulty).toBe('number');
    expect(typeof block.time).toBe('number');
    expect(typeof block.mediantime).toBe('number');
    expect(typeof block.chainwork).toBe('string');
    expect(typeof block.previousblockhash).toBe('string');
    expect(typeof block.chainlock).toBe('boolean');
    expect(Array.isArray(block.tx)).toBe(true);
  });

  it('includes cbTx on the block', async () => {
    const block = await client.getBlock(bestHash);
    expect(block.cbTx).toBeDefined();
    expect(typeof block.cbTx!.merkleRootMNList).toBe('string');
    expect(typeof block.cbTx!.merkleRootQuorums).toBe('string');
  });

  it('includes full transaction objects at verbosity 2', async () => {
    const block = await client.getBlock(bestHash);
    const tx = block.tx[0]!;
    expect(typeof tx.txid).toBe('string');
    expect(typeof tx.type).toBe('number');
    expect(Array.isArray(tx.vin)).toBe(true);
    expect(Array.isArray(tx.vout)).toBe(true);
  });
});

describe('getBlockchainInfo', () => {
  it('returns chain info with expected fields', async () => {
    const info = await client.getBlockchainInfo();
    expect(info.chain).toBe('main');
    expect(info.blocks).toBeGreaterThanOrEqual(blockCount);
    expect(info.bestblockhash).toMatch(/^[0-9a-f]{64}$/);
    expect(typeof info.difficulty).toBe('number');
    expect(typeof info.pruned).toBe('boolean');
    expect(Array.isArray(info.softforks)).toBe(true);
    expect(typeof info.bip9_softforks).toBe('object');
  });
});

describe('getTxOutSetInfo', () => {
  it('returns UTXO set info with expected fields', async () => {
    const info = await client.getTxOutSetInfo();
    expect(info.height).toBe(blockCount);
    expect(info.bestblock).toBe(bestHash);
    expect(typeof info.transactions).toBe('number');
    expect(typeof info.txouts).toBe('number');
    expect(typeof info.total_amount).toBe('number');
    expect(info.total_amount).toBeGreaterThan(0);
  });
});
