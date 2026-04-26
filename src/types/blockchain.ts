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
