import { MempoolEntry } from './mempool.js';
import { Transaction } from './transactions.js';

export interface SoftFork {
  id: string;
  version: number;
  reject: { status: boolean };
}

export interface Bip9SoftFork {
  status: string;
  startTime: number;
  timeout: number;
  since: number;
}

export interface BlockchainInfo {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  mediantime: number;
  verificationprogress: number;
  chainwork: string;
  pruned: boolean;
  softforks: SoftFork[];
  bip9_softforks: Record<string, Bip9SoftFork>;
}

export interface TxOutSetInfo {
  height: number;
  bestblock: string;
  transactions: number;
  txouts: number;
  hash_serialized_2: string;
  disk_size: number;
  total_amount: number;
}

export type ChainTipStatus =
  | 'invalid'
  | 'headers-only'
  | 'valid-headers'
  | 'valid-fork'
  | 'active';

export interface ChainTip {
  height: number;
  hash: string;
  branchlen: number;
  status: ChainTipStatus;
}

export type MempoolAncestorsResult<V extends boolean = false> = V extends true
  ? Record<string, MempoolEntry>
  : string[];

export type MempoolDescendantsResult<V extends boolean = false> = V extends true
  ? Record<string, MempoolEntry>
  : string[];

export type SpecialTxesResult<Verbosity extends 0 | 1 | 2 = 0> =
  Verbosity extends 2 ? Transaction[] : string[];
