import { buildHttpClient } from './http.js';
import { callRpc, callRpcBatch } from './rpc.js';
import type {
  RpcConfig,
  BatchCall,
  BatchResult,
  Block,
  BlockchainInfo,
  Transaction,
  TxOutSetInfo,
  NetworkInfo,
  PeerInfo,
  MempoolInfo,
  MempoolEntry,
  RawMempool,
} from '../types/index.js';

export interface FiroRpcClient {
  call<T = unknown>(method: string, ...params: unknown[]): Promise<T>;
  batch(calls: BatchCall[]): Promise<BatchResult[]>;

  // blockchain
  getBlockCount(): Promise<number>;
  getBlockHash(height: number): Promise<string>;
  getBlock(hash: string): Promise<Block>;
  getBlockchainInfo(): Promise<BlockchainInfo>;
  getTxOutSetInfo(): Promise<TxOutSetInfo>;

  // transactions
  getRawTransaction(txid: string): Promise<Transaction>;

  // mempool
  getMempoolInfo(): Promise<MempoolInfo>;
  getRawMempool(): Promise<RawMempool>;
  getMempoolEntry(txid: string): Promise<MempoolEntry>;

  // network
  getNetworkInfo(): Promise<NetworkInfo>;
  getPeerInfo(): Promise<PeerInfo[]>;
}

export function createFiroRpcClient(config: RpcConfig): FiroRpcClient {
  const http = buildHttpClient(config);

  return {
    call<T = unknown>(method: string, ...params: unknown[]): Promise<T> {
      return callRpc<T>(http, method, params);
    },
    batch(calls: BatchCall[]): Promise<BatchResult[]> {
      return callRpcBatch(http, calls);
    },

    getBlockCount(): Promise<number> {
      return callRpc<number>(http, 'getblockcount', []);
    },
    getBlockHash(height: number): Promise<string> {
      return callRpc<string>(http, 'getblockhash', [height]);
    },
    getBlock(hash: string): Promise<Block> {
      return callRpc<Block>(http, 'getblock', [hash, 2]);
    },
    getBlockchainInfo(): Promise<BlockchainInfo> {
      return callRpc<BlockchainInfo>(http, 'getblockchaininfo', []);
    },
    getTxOutSetInfo(): Promise<TxOutSetInfo> {
      return callRpc<TxOutSetInfo>(http, 'gettxoutsetinfo', []);
    },

    getRawTransaction(txid: string): Promise<Transaction> {
      return callRpc<Transaction>(http, 'getrawtransaction', [txid, true]);
    },

    getMempoolInfo(): Promise<MempoolInfo> {
      return callRpc<MempoolInfo>(http, 'getmempoolinfo', []);
    },
    getRawMempool(): Promise<RawMempool> {
      return callRpc<RawMempool>(http, 'getrawmempool', [true]);
    },
    getMempoolEntry(txid: string): Promise<MempoolEntry> {
      return callRpc<MempoolEntry>(http, 'getmempoolentry', [txid]);
    },

    getNetworkInfo(): Promise<NetworkInfo> {
      return callRpc<NetworkInfo>(http, 'getnetworkinfo', []);
    },
    getPeerInfo(): Promise<PeerInfo[]> {
      return callRpc<PeerInfo[]>(http, 'getpeerinfo', []);
    },
  };
}
