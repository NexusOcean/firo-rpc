import { makeClient } from './setup.js';

const client = makeClient();

describe('getSparkLatestCoinId', () => {
  it('returns a positive integer', async () => {
    const id = await client.getSparkLatestCoinId();
    expect(Number.isInteger(id)).toBe(true);
    expect(id).toBeGreaterThan(0);
  });
});

describe('getSparkAnonymitySetMeta', () => {
  it('returns meta for coin group 1', async () => {
    const meta = await client.getSparkAnonymitySetMeta(1);
    // base64-encoded 32-byte hashes
    expect(meta.blockHash).toMatch(/^[A-Za-z0-9+/]{43}=$/);
    expect(meta.setHash).toMatch(/^[A-Za-z0-9+/]{43}=$/);
    expect(typeof meta.size).toBe('number');
    expect(meta.size).toBeGreaterThan(0);
  });
});

describe('getSparkAnonymitySetSector', () => {
  it('returns coin tuples paged from coin group 1', async () => {
    const meta = await client.getSparkAnonymitySetMeta(1);
    const sector = await client.getSparkAnonymitySetSector(
      1,
      meta.blockHash,
      0,
      10,
    );
    expect(Array.isArray(sector.coins)).toBe(true);
    expect(sector.coins.length).toBeGreaterThan(0);
    expect(sector.coins.length).toBeLessThanOrEqual(10);
    const [serializedCoin, txHash, txMetadata] = sector.coins[0]!;
    expect(typeof serializedCoin).toBe('string');
    expect(typeof txHash).toBe('string');
    expect(typeof txMetadata).toBe('string');
    // txHash decodes to exactly 32 bytes (44-char base64 with padding)
    expect(txHash).toMatch(/^[A-Za-z0-9+/]{43}=$/);
  });
});

describe('getSparkAnonymitySet', () => {
  it('returns the anonymity set for coin group 1 from genesis', async () => {
    const startHash = await client.getBlockHash(0);
    const set = await client.getSparkAnonymitySet(1, startHash);
    // base64-encoded 32-byte hashes
    expect(set.blockHash).toMatch(/^[A-Za-z0-9+/]{43}=$/);
    expect(set.setHash).toMatch(/^[A-Za-z0-9+/]{43}=$/);
    expect(Array.isArray(set.coins)).toBe(true);
    expect(set.coins.length).toBeGreaterThan(0);
    const [serializedCoin, txHash, txMetadata] = set.coins[0]!;
    expect(typeof serializedCoin).toBe('string');
    expect(typeof txHash).toBe('string');
    expect(typeof txMetadata).toBe('string');
    expect(txHash).toMatch(/^[A-Za-z0-9+/]{43}=$/);
  });
});

describe('getMempoolSparkTxIds', () => {
  it('returns an array of base64 spark txids', async () => {
    const txids = await client.getMempoolSparkTxIds();
    expect(Array.isArray(txids)).toBe(true);
    // mempool may be empty; only validate format if present
    for (const txid of txids) {
      expect(txid).toMatch(/^[A-Za-z0-9+/]{43}=$/);
    }
  });
});
