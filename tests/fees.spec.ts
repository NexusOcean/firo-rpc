import { makeClient } from './setup.js';

const client = makeClient();

describe('getFeeRate', () => {
  it('returns a fee rate in satoshis/kB', async () => {
    const result = await client.getFeeRate();
    expect(typeof result.rate).toBe('number');
    expect(result.rate).toBeGreaterThan(0);
  });
});

describe('estimateFee', () => {
  it('returns a fee estimate in FIRO/kB for 6 blocks', async () => {
    const fee = await client.estimateFee(6);
    expect(typeof fee).toBe('number');
    // -1 when no estimate available, otherwise a positive decimal
    expect(fee === -1 || fee > 0).toBe(true);
  });
});

describe('estimateSmartFee', () => {
  it('returns a smart fee estimate for 6 blocks', async () => {
    const result = await client.estimateSmartFee(6);
    expect(typeof result.feerate).toBe('number');
    expect(typeof result.blocks).toBe('number');
    expect(result.blocks).toBeGreaterThan(0);
  });
});

describe('estimatePriority', () => {
  it('returns a priority estimate for 6 blocks', async () => {
    const priority = await client.estimatePriority(6);
    expect(typeof priority).toBe('number');
  });
});

describe('estimateSmartPriority', () => {
  it('returns a smart priority estimate for 6 blocks', async () => {
    const result = await client.estimateSmartPriority(6);
    expect(typeof result.priority).toBe('number');
    expect(typeof result.blocks).toBe('number');
    expect(result.blocks).toBeGreaterThan(0);
  });
});
