import dotenv from 'dotenv';
import { createFiroRpcClient, RpcCallError } from '../src/index.js';

const { parsed } = dotenv.config({ path: '.env.test' });
const { FIRO_HOST, FIRO_USER, FIRO_PASS, FIRO_PORT, FIRO_PROTOCOL } = parsed as Record<
  string,
  string
>;

describe('FiroRpcClient (integration)', () => {
  const client = createFiroRpcClient({
    host: FIRO_HOST!,
    port: parseInt(FIRO_PORT!, 10),
    user: FIRO_USER!,
    pass: FIRO_PASS!,
    protocol: FIRO_PROTOCOL as 'http' | 'https',
  });

  let blockCount: number;
  let bestHash: string;

  beforeAll(async () => {
    blockCount = await client.call<number>('getblockcount');
    bestHash = await client.call<string>('getbestblockhash');
  });

  // ─── call ──────────────────────────────────────────────────────────────────

  describe('call', () => {
    it('returns a block count as a number', () => {
      expect(typeof blockCount).toBe('number');
      expect(blockCount).toBeGreaterThan(0);
    });

    it('returns the best block hash as a 64-char hex string', () => {
      expect(typeof bestHash).toBe('string');
      expect(bestHash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('returns a block with expected fields', async () => {
      const block = await client.call<Record<string, unknown>>('getblock', bestHash);
      expect(block.hash).toBe(bestHash);
      expect(typeof block.height).toBe('number');
      expect(typeof block.time).toBe('number');
      expect(Array.isArray(block.tx)).toBe(true);
    });

    it('throws RpcCallError on a bogus method', async () => {
      await expect(client.call('not_a_real_rpc_method')).rejects.toBeInstanceOf(RpcCallError);
    });
  });

  // ─── batch ─────────────────────────────────────────────────────────────────

  describe('batch', () => {
    it('returns one result per request in order', async () => {
      const heights = [blockCount, blockCount - 1, blockCount - 2];
      const results = await client.batch(
        heights.map((h) => ({ method: 'getblockhash', params: [h] })),
      );
      expect(results).toHaveLength(3);
      results.forEach((r) => {
        expect(r.error).toBeNull();
        expect(typeof r.result).toBe('string');
      });
    });

    it('isolates errors across calls', async () => {
      const results = await client.batch([
        { method: 'getblockcount' },
        { method: 'bogusmethod' },
        { method: 'getbestblockhash' },
      ]);
      expect(results[0]!.error).toBeNull();
      expect(results[1]!.error).not.toBeNull();
      expect(results[2]!.error).toBeNull();
    });

    it('short-circuits on empty batch', async () => {
      const results = await client.batch([]);
      expect(results).toEqual([]);
    });
  });

  // ─── auth failures ─────────────────────────────────────────────────────────

  describe('auth failures', () => {
    it('throws on bad credentials', async () => {
      const badClient = createFiroRpcClient({
        host: FIRO_HOST!,
        port: parseInt(FIRO_PORT!, 10),
        user: 'wrong',
        pass: 'wrong',
        protocol: FIRO_PROTOCOL as 'http' | 'https',
      });
      await expect(badClient.call('getblockcount')).rejects.toMatchObject({
        name: 'RpcCallError',
        httpStatus: 401,
      });
    });
  });

  // ─── blockchain ────────────────────────────────────────────────────────────

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
      expect(typeof block.cbTx.merkleRootMNList).toBe('string');
      expect(typeof block.cbTx.merkleRootQuorums).toBe('string');
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
      expect(info.blocks).toBe(blockCount);
      expect(info.bestblockhash).toBe(bestHash);
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

  // ─── transactions ──────────────────────────────────────────────────────────

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
      if (!standardTx) return; // skip if block has no standard txs
      const tx = await client.getRawTransaction(standardTx.txid);
      expect(tx.type).toBe(0);
      const vin = tx.vin[0]! as { address?: string };
      expect(typeof vin.address).toBe('string');
    });
  });

  // ─── mempool ───────────────────────────────────────────────────────────────

  describe('getMempoolInfo', () => {
    it('returns mempool info with expected fields', async () => {
      const info = await client.getMempoolInfo();
      expect(typeof info.size).toBe('number');
      expect(typeof info.bytes).toBe('number');
      expect(typeof info.usage).toBe('number');
      expect(typeof info.maxmempool).toBe('number');
      expect(typeof info.instantsendlocks).toBe('number');
    });
  });

  describe('getRawMempool', () => {
    it('returns a record of txid to mempool entry', async () => {
      const mempool = await client.getRawMempool();
      expect(typeof mempool).toBe('object');
      const entries = Object.values(mempool);
      if (entries.length > 0) {
        const entry = entries[0]!;
        expect(typeof entry.size).toBe('number');
        expect(typeof entry.fee).toBe('number');
        expect(typeof entry.time).toBe('number');
        expect(typeof entry.instantlock).toBe('boolean');
        expect(Array.isArray(entry.depends)).toBe(true);
      }
    });
  });

  describe('getMempoolEntry', () => {
    it('throws RpcCallError for a txid not in mempool', async () => {
      const fakeTxid = 'a'.repeat(64);
      await expect(client.getMempoolEntry(fakeTxid)).rejects.toBeInstanceOf(RpcCallError);
    });
  });

  // ─── network ───────────────────────────────────────────────────────────────

  describe('getNetworkInfo', () => {
    it('returns network info with expected fields', async () => {
      const info = await client.getNetworkInfo();
      expect(typeof info.version).toBe('number');
      expect(typeof info.subversion).toBe('string');
      expect(typeof info.protocolversion).toBe('number');
      expect(typeof info.connections).toBe('number');
      expect(typeof info.networkactive).toBe('boolean');
      expect(typeof info.relayfee).toBe('number');
      expect(Array.isArray(info.networks)).toBe(true);
    });
  });

  describe('getPeerInfo', () => {
    it('returns an array of peers with expected fields', async () => {
      const peers = await client.getPeerInfo();
      expect(Array.isArray(peers)).toBe(true);
      expect(peers.length).toBeGreaterThan(0);
      const peer = peers[0]!;
      expect(typeof peer.id).toBe('number');
      expect(typeof peer.addr).toBe('string');
      expect(typeof peer.version).toBe('number');
      expect(typeof peer.inbound).toBe('boolean');
      expect(typeof peer.synced_blocks).toBe('number');
      expect(typeof peer.bytessent_per_msg).toBe('object');
      expect(typeof peer.bytesrecv_per_msg).toBe('object');
    });
  });
});
