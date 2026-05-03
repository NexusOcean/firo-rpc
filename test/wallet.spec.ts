import { makeClient, shouldTestSend } from './setup.js';

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

describe('listTransactions', () => {
  it('returns an array of wallet transactions', async () => {
    const txs = await client.listTransactions('*', 10);
    expect(Array.isArray(txs)).toBe(true);
    if (txs.length === 0) return;
    const tx = txs[0]!;
    expect(typeof tx.txid).toBe('string');
    expect(typeof tx.amount).toBe('number');
    expect(typeof tx.confirmations).toBe('number');
    expect(typeof tx.address).toBe('string');
    expect(['send', 'receive', 'generate', 'immature', 'orphan']).toContain(tx.category);
    expect(typeof tx.time).toBe('number');
    expect(Array.isArray(tx.walletconflicts)).toBe(true);
  });
});

describe('getTransaction', () => {
  it('returns full wallet transaction with details and hex', async () => {
    const txs = await client.listTransactions('*', 1);
    if (txs.length === 0) return;
    const tx = await client.getTransaction(txs[0]!.txid);
    expect(typeof tx.amount).toBe('number');
    expect(typeof tx.confirmations).toBe('number');
    expect(typeof tx.txid).toBe('string');
    expect(typeof tx.hex).toBe('string');
    expect(Array.isArray(tx.details)).toBe(true);
    expect(tx.details.length).toBeGreaterThan(0);
    const detail = tx.details[0]!;
    expect(typeof detail.address).toBe('string');
    expect(typeof detail.amount).toBe('number');
    expect(typeof detail.vout).toBe('number');
  });
});

describe('listSinceBlock', () => {
  it('returns transactions since genesis when no blockhash given', async () => {
    const result = await client.listSinceBlock();
    expect(Array.isArray(result.transactions)).toBe(true);
    expect(typeof result.lastblock).toBe('string');
    expect(result.lastblock).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns transactions since a specific block', async () => {
    const count = await client.getBlockCount();
    const hash = await client.getBlockHash(Math.max(1, count - 10));
    const result = await client.listSinceBlock(hash, 1);
    expect(Array.isArray(result.transactions)).toBe(true);
    expect(typeof result.lastblock).toBe('string');
  });
});

(shouldTestSend ? describe : describe.skip)('sendToAddress', () => {
  it('sends to an address and returns txid', async () => {
    const addr = await client.getNewAddress();
    const txid = await client.sendToAddress(addr, 0.0001);
    expect(txid).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('getReceivedByAddress', () => {
  it('returns a non-negative amount for a wallet address', async () => {
    const addr = await client.getNewAddress();
    const received = await client.getReceivedByAddress(addr);
    expect(typeof received).toBe('number');
    expect(received).toBeGreaterThanOrEqual(0);
  });

  it('respects minconf parameter', async () => {
    const addr = await client.getNewAddress();
    const received = await client.getReceivedByAddress(addr, 6);
    expect(typeof received).toBe('number');
    expect(received).toBeGreaterThanOrEqual(0);
  });
});
