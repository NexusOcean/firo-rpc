import { makeClient } from './setup.js';

const client = makeClient();

describe('evoznodeList', () => {
  it('returns a map of outpoint to znode info', async () => {
    const list = await client.evoznodeList();
    const keys = Object.keys(list);
    expect(keys.length).toBeGreaterThan(0);
    const entry = list[keys[0]!]!;
    expect(typeof entry.proTxHash).toBe('string');
    expect(typeof entry.address).toBe('string');
    expect(typeof entry.status).toBe('string');
  }, 30000);
});

describe('evoznodeCount', () => {
  it('returns total and enabled counts', async () => {
    const count = await client.evoznodeCount();
    expect(typeof count.total).toBe('number');
    expect(typeof count.enabled).toBe('number');
    expect(count.total).toBeGreaterThanOrEqual(count.enabled);
  });
});

describe('evoznodeCurrent', () => {
  it('returns the current znode payee info', async () => {
    const current = await client.evoznodeCurrent();
    expect(typeof current.height).toBe('number');
    expect(typeof current.proTxHash).toBe('string');
    expect(typeof current.payee).toBe('string');
  });
});

describe('evoznodeWinner', () => {
  it('returns the next znode winner info', async () => {
    const winner = await client.evoznodeWinner();
    expect(typeof winner.height).toBe('number');
    expect(typeof winner.proTxHash).toBe('string');
    expect(typeof winner.payee).toBe('string');
  });
});

describe('evoznodeWinners', () => {
  it('returns a map of height to payee address', async () => {
    const winners = await client.evoznodeWinners();
    const heights = Object.keys(winners);
    expect(heights.length).toBeGreaterThan(0);
    for (const height of heights) {
      expect(Number.isInteger(Number(height))).toBe(true);
      expect(typeof winners[height]).toBe('string');
    }
  });
});

describe('blsGenerate', () => {
  it('returns a secret/public key pair', async () => {
    const pair = await client.blsGenerate();
    expect(typeof pair.secret).toBe('string');
    expect(typeof pair.public).toBe('string');
  });
});

describe('blsFromSecret', () => {
  it('derives the same public key from a given secret', async () => {
    const generated = await client.blsGenerate();
    const derived = await client.blsFromSecret(generated.secret);
    expect(derived.public).toBe(generated.public);
  });
});

describe('sporkList', () => {
  it('returns blockchain and mempool arrays', async () => {
    const sporks = await client.sporkList();
    expect(Array.isArray(sporks.blockchain)).toBe(true);
    expect(Array.isArray(sporks.mempool)).toBe(true);
  });
});

describe('evoznsyncStatus', () => {
  it('returns sync status fields', async () => {
    const status = await client.evoznsyncStatus();
    expect(typeof status.AssetID).toBe('number');
    expect(typeof status.AssetName).toBe('string');
    expect(typeof status.IsSynced).toBe('boolean');
    expect(typeof status.IsBlockchainSynced).toBe('boolean');
  });
});
