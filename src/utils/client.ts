import { buildHttpClient } from './http.js';
import { callRpc, callRpcBatch } from './rpc.js';
import type { RpcConfig, BatchCall, BatchResult } from '../types/index.js';

import {
  createBlockchainMethods,
  type BlockchainMethods,
  createNetworkMethods,
  type NetworkMethods,
  createWalletMethods,
  type WalletMethods,
  createSparkMethods,
  type SparkMethods,
  createAddressIndexMethods,
  type AddressIndexMethods,
  createFeesMethods,
  type FeesMethods,
  createRawTransactionMethods,
  type RawTransactionMethods,
  createEvoMethods,
  type EvoMethods,
  createUtilMethods,
  type UtilMethods,
} from './methods/index.js';

export interface FiroRpcClient
  extends
    BlockchainMethods,
    NetworkMethods,
    WalletMethods,
    SparkMethods,
    AddressIndexMethods,
    FeesMethods,
    RawTransactionMethods,
    EvoMethods,
    UtilMethods {
  call<T = unknown>(method: string, ...params: unknown[]): Promise<T>;
  batch(calls: BatchCall[]): Promise<BatchResult[]>;
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

    ...createBlockchainMethods(http),
    ...createNetworkMethods(http),
    ...createWalletMethods(http),
    ...createSparkMethods(http),
    ...createAddressIndexMethods(http),
    ...createFeesMethods(http),
    ...createRawTransactionMethods(http),
    ...createEvoMethods(http),
    ...createUtilMethods(http),
  };
}
