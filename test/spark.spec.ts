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
