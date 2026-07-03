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

describe('getChainTips', () => {
  it('returns an array of chain tips including the active tip', async () => {
    const tips = await client.getChainTips();
    expect(Array.isArray(tips)).toBe(true);
    expect(tips.length).toBeGreaterThan(0);
    const activeTip = tips.find((t) => t.status === 'active');
    expect(activeTip).toBeDefined();
    expect(typeof activeTip!.height).toBe('number');
    expect(activeTip!.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(activeTip!.branchlen).toBe(0);
  });
});

describe('getDifficulty', () => {
  it('returns a positive number', async () => {
    const difficulty = await client.getDifficulty();
    expect(typeof difficulty).toBe('number');
    expect(difficulty).toBeGreaterThan(0);
  });
});

describe('getMempoolAncestors', () => {
  it('is a function', () => {
    // Placeholder: requires an unconfirmed txid in the mempool
    expect(typeof client.getMempoolAncestors).toBe('function');
  });
});

describe('getMempoolDescendants', () => {
  it('is a function', () => {
    // Placeholder: requires an unconfirmed txid in the mempool
    expect(typeof client.getMempoolDescendants).toBe('function');
  });
});

describe('getSpecialTxes', () => {
  it('returns an array of txids for the best block', async () => {
    const txids = await client.getSpecialTxes(bestHash);
    expect(Array.isArray(txids)).toBe(true);
    for (const txid of txids) {
      expect(typeof txid).toBe('string');
    }
  });
});

describe('getTxOutProof / verifyTxOutProof', () => {
  it('generates and verifies a proof for a txid in the best block', async () => {
    const block = await client.getBlock(bestHash);
    const txid = block.tx[0]!.txid;
    const proof = await client.getTxOutProof([txid], bestHash);
    expect(typeof proof).toBe('string');

    const verified = await client.verifyTxOutProof(proof);
    expect(verified).toContain(txid);
  });
});

describe('verifyChain', () => {
  it('returns a boolean', async () => {
    const result = await client.verifyChain();
    expect(typeof result).toBe('boolean');
  });
});

describe('clearMempool', () => {
  it('is a function', () => {
    // Placeholder: write/mutating (clears local mempool)
    expect(typeof client.clearMempool).toBe('function');
  });
});

describe('preciousBlock', () => {
  it('is a function', () => {
    // Placeholder: write/mutating (alters local block-tree preference)
    expect(typeof client.preciousBlock).toBe('function');
  });
});

describe('pruneBlockchain', () => {
  it('is a function', () => {
    // Placeholder: write/destructive, intended for pruned node
    expect(typeof client.pruneBlockchain).toBe('function');
  });
});
