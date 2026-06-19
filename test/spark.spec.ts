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

describe('getSparkNames', () => {
  it('returns an array of spark names', async () => {
    const names = await client.getSparkNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
  });

  it('each entry has required fields', async () => {
    const names = await client.getSparkNames();
    for (const entry of names) {
      expect(typeof entry.name).toBe('string');
      expect(typeof entry.address).toBe('string');
      expect(typeof entry.validUntil).toBe('number');
      expect(entry.validUntil).toBeGreaterThan(0);
      if (entry.additionalInfo !== undefined) {
        expect(typeof entry.additionalInfo).toBe('string');
      }
    }
  });
});

describe('getSparkNameData', () => {
  it('returns data for a known name', async () => {
    const data = await client.getSparkNameData('zerocoin');
    expect(typeof data.address).toBe('string');
    expect(data.address.startsWith('sm1')).toBe(true);
    expect(typeof data.validUntil).toBe('number');
    expect(data.validUntil).toBeGreaterThan(0);
  });

  it('additionalInfo is a string when present', async () => {
    const data = await client.getSparkNameData('zerocoin');
    if (data.additionalInfo !== undefined) {
      expect(typeof data.additionalInfo).toBe('string');
    }
  });
});

describe('getSparkNameTxDetails', () => {
  it('returns spark name details for a registration txid', async () => {
    const details = await client.getSparkNameTxDetails(
      '6e881bfcdf6fdf210e18fbbae861cfd88f820310e6f785ba3f2d7335bdf97b8e',
    );
    expect(typeof details.name).toBe('string');
    expect(typeof details.address).toBe('string');
    expect(details.address.startsWith('sm1')).toBe(true);
    expect(typeof details.validUntil).toBe('number');
    expect(details.validUntil).toBeGreaterThan(0);
  });
});

describe('getSparkBalance', () => {
  it('returns balance fields', async () => {
    const balance = await client.getSparkBalance();
    expect(typeof balance.availableBalance).toBe('number');
    expect(typeof balance.unconfirmedBalance).toBe('number');
    expect(typeof balance.fullBalance).toBe('number');
    expect(balance.availableBalance).toBeGreaterThanOrEqual(0);
  });
});

describe('getSparkAddressBalance', () => {
  it('returns balance fields for a known address', async () => {
    const balance = await client.getSparkAddressBalance(
      'sm1kwyjxp6kthrt8nws7q3tk03s3nfwg6r4n6e9y5tr8kdd9zhy5zytprye4u3vxu7z92w8gdyh27xt0qmky3pajw0tthmyl3fgv2de53mynu9zwsl4v8azc85cvlplyw3aeufnl2gxrxz9w',
    );
    expect(typeof balance.availableBalance).toBe('number');
    expect(typeof balance.unconfirmedBalance).toBe('number');
    expect(typeof balance.fullBalance).toBe('number');
  });
});

describe('sendSpark', () => {
  it('is a function', () => {
    expect(typeof client.sendSpark).toBe('function');
  });
});

describe('registerSparkName', () => {
  it('is a function', () => {
    expect(typeof client.registerSparkName).toBe('function');
  });
});

describe('requestSparkNameTransfer', () => {
  it('is a function', () => {
    expect(typeof client.requestSparkNameTransfer).toBe('function');
  });
});

describe('transferSparkName', () => {
  it('is a function', () => {
    expect(typeof client.transferSparkName).toBe('function');
  });
});
