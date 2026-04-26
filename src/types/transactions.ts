import type { ScriptPubKey, ScriptSig } from './shared.js';

export interface CoinbaseVin {
  coinbase: string;
  sequence: number;
}

export interface StandardVin {
  txid: string;
  vout: number;
  scriptSig: ScriptSig;
  value: number;
  valueSat: number;
  address: string;
  sequence: number;
}

export interface SparkSpendVin {
  scriptSig: ScriptSig;
  nFees: number;
  lTags: string[];
  sequence: number;
}

export type Vin = CoinbaseVin | StandardVin | SparkSpendVin;

export interface Vout {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
}

export interface CbTx {
  version: number;
  height: number;
  merkleRootMNList: string;
  merkleRootQuorums: string;
}

export interface ProUpServTx {
  version: number;
  proTxHash: string;
  service: string;
  inputsHash: string;
}

export interface QuorumCommitment {
  version: number;
  llmqType: number;
  quorumHash: string;
  signersCount: number;
  validMembersCount: number;
  quorumPublicKey: string;
}

export interface FinalCommitment {
  version: number;
  height: number;
  commitment: QuorumCommitment;
}

export type TxType = 0 | 2 | 5 | 6 | 8 | 9 | 14;

export interface Transaction {
  txid: string;
  hash: string;
  hex: string;
  size: number;
  vsize: number;
  version: number;
  locktime: number;
  type: TxType;
  vin: Vin[];
  vout: Vout[];
  blockhash: string;
  height: number;
  confirmations: number;
  time: number;
  blocktime: number;
  instantlock: boolean;
  chainlock: boolean;
  cbTx?: CbTx;
  proUpServ?: ProUpServTx;
  finalCommitment?: FinalCommitment;
  sparkData?: string;
}
