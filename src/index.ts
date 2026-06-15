export { createFiroRpcClient } from './utils/client.js';
export { RpcCallError } from './utils/rpc.js';
export type { FiroRpcClient } from './utils/client.js';

export type {
  // RPC core
  RpcConfig,
  RpcRequest,
  RpcResponse,
  RpcError,
  BatchCall,
  BatchResult,
  // Firo types
  Block,
  BlockchainInfo,
  Bip9SoftFork,
  SoftFork,
  Transaction,
  TxType,
  Vin,
  CoinbaseVin,
  StandardVin,
  SparkSpendVin,
  Vout,
  ScriptSig,
  ScriptPubKey,
  CbTx,
  ProUpServTx,
  FinalCommitment,
  QuorumCommitment,
  TxOutSetInfo,
  NetworkInfo,
  PeerInfo,
  MempoolInfo,
  MempoolEntry,
  RawMempool,
  FiroAddressBalance,
  FiroAddressTxIds,
  // Spark read-only
  SparkAnonymitySetMeta,
  SparkAnonymitySetSector,
  SparkAnonymitySetCoin,
  SparkAnonymitySet,
  // Fees
  FeeRate,
  SmartFeeEstimate,
  SmartPriorityEstimate,
} from './types/index.js';
