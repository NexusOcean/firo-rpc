import { makeClient } from './setup.js';

const client = makeClient();

describe('getWalletInfo', () => {
  it('returns wallet metadata with expected fields', async () => {
    const info = await client.getWalletInfo();
    expect(typeof info.walletversion).toBe('number');
    expect(typeof info.balance).toBe('number');
    expect(typeof info.unconfirmed_balance).toBe('number');
    expect(typeof info.immature_balance).toBe('number');
    expect(typeof info.txcount).toBe('number');
    expect(typeof info.keypoololdest).toBe('number');
    expect(typeof info.keypoolsize).toBe('number');
    expect(typeof info.paytxfee).toBe('number');
  });
});

describe('getNewAddress', () => {
  it('returns a non-empty address string', async () => {
    const addr = await client.getNewAddress();
    expect(typeof addr).toBe('string');
    expect(addr.length).toBeGreaterThan(0);
  });

  it('accepts an optional label', async () => {
    const addr = await client.getNewAddress('test-label');
    expect(typeof addr).toBe('string');
    expect(addr.length).toBeGreaterThan(0);
  });
});

describe('validateAddress', () => {
  it('validates a freshly generated address as mine', async () => {
    const addr = await client.getNewAddress();
    const result = await client.validateAddress(addr);
    expect(result.isvalid).toBe(true);
    expect(result.address).toBe(addr);
    expect(result.ismine).toBe(true);
    expect(result.iswatchonly).toBe(false);
    expect(typeof result.scriptPubKey).toBe('string');
    expect(typeof result.pubkey).toBe('string');
    expect(typeof result.hdkeypath).toBe('string');
  });

  it('flags an invalid address', async () => {
    const result = await client.validateAddress('not-a-real-address');
    expect(result.isvalid).toBe(false);
  });
});

describe('getBalance', () => {
  it('returns a non-negative number', async () => {
    const balance = await client.getBalance();
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  it('accepts a minconf parameter', async () => {
    const balance = await client.getBalance(6);
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
  });
});

describe('getUnconfirmedBalance', () => {
  it('returns a non-negative number', async () => {
    const balance = await client.getUnconfirmedBalance();
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
  });
});
