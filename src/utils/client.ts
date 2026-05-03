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
  FiroAddressBalance,
  FiroAddressTxIds,
  WalletInfo,
  ValidateAddressResult,
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
  getRawTransaction(txid: string, verbose: true): Promise<Transaction>;
  getRawTransaction(txid: string, verbose: false): Promise<string>;

  // mempool
  getMempoolInfo(): Promise<MempoolInfo>;
  getRawMempool(): Promise<RawMempool>;
  getRawMempool(verbose: true): Promise<RawMempool>;
  getRawMempool(verbose: false): Promise<string[]>;
  getMempoolEntry(txid: string): Promise<MempoolEntry>;

  // network
  getNetworkInfo(): Promise<NetworkInfo>;
  getPeerInfo(): Promise<PeerInfo[]>;

  // address index (requires -addressindex on your node)
  getAddressBalance(address: string): Promise<FiroAddressBalance>;
  getAddressTxIds(address: string): Promise<FiroAddressTxIds>;

  // wallet
  getWalletInfo(): Promise<WalletInfo>;
  getNewAddress(label?: string): Promise<string>;
  validateAddress(address: string): Promise<ValidateAddressResult>;
  getBalance(minconf?: number): Promise<number>;
  getUnconfirmedBalance(): Promise<number>;
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

    getRawTransaction: ((txid: string, verbose: boolean = true) =>
      callRpc<Transaction | string>(http, 'getrawtransaction', [
        txid,
        verbose,
      ])) as FiroRpcClient['getRawTransaction'],

    getMempoolInfo(): Promise<MempoolInfo> {
      return callRpc<MempoolInfo>(http, 'getmempoolinfo', []);
    },

    getRawMempool: ((verbose: boolean = true) =>
      callRpc<RawMempool | string[]>(http, 'getrawmempool', [
        verbose,
      ])) as FiroRpcClient['getRawMempool'],

    getMempoolEntry(txid: string): Promise<MempoolEntry> {
      return callRpc<MempoolEntry>(http, 'getmempoolentry', [txid]);
    },

    getNetworkInfo(): Promise<NetworkInfo> {
      return callRpc<NetworkInfo>(http, 'getnetworkinfo', []);
    },

    getPeerInfo(): Promise<PeerInfo[]> {
      return callRpc<PeerInfo[]>(http, 'getpeerinfo', []);
    },

    getAddressBalance(address: string): Promise<FiroAddressBalance> {
      return callRpc<FiroAddressBalance>(http, 'getaddressbalance', [{ addresses: [address] }]);
    },

    getAddressTxIds(address: string): Promise<FiroAddressTxIds> {
      return callRpc<FiroAddressTxIds>(http, 'getaddresstxids', [{ addresses: [address] }]);
    },

    getWalletInfo(): Promise<WalletInfo> {
      return callRpc<WalletInfo>(http, 'getwalletinfo', []);
    },

    getNewAddress(label?: string): Promise<string> {
      return callRpc<string>(http, 'getnewaddress', label !== undefined ? [label] : []);
    },

    validateAddress(address: string): Promise<ValidateAddressResult> {
      return callRpc<ValidateAddressResult>(http, 'validateaddress', [address]);
    },

    getBalance(minconf: number = 1): Promise<number> {
      return callRpc<number>(http, 'getbalance', ['*', minconf]);
    },

    getUnconfirmedBalance(): Promise<number> {
      return callRpc<number>(http, 'getunconfirmedbalance', []);
    },
  };
}
