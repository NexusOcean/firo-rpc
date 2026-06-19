export interface SparkAnonymitySetMeta {
  blockHash: string;
  setHash: string;
  size: number;
}

export type SparkAnonymitySetCoin = [
  serializedCoin: string,
  txHash: string,
  txMetadata: string,
];

export interface SparkAnonymitySetSector {
  coins: SparkAnonymitySetCoin[];
}

export interface SparkAnonymitySet {
  blockHash: string;
  setHash: string;
  coins: SparkAnonymitySetCoin[];
}

export interface SparkName {
  name: string;
  address: string;
  validUntil: number; // block height
  additionalInfo?: string;
}

export interface SparkNameData {
  address: string;
  validUntil: number; // block height
  additionalInfo?: string;
}

export interface SparkRecipient {
  amount: number;
  subtractFee: boolean;
  memo?: string;
}

export type SparkSendRecipients = Record<string, SparkRecipient>;

export interface SparkAddressBalance {
  availableBalance: number;
  unconfirmedBalance: number;
  fullBalance: number;
}

export interface UsedCoinsTags {
  tags: string[];
}

export interface SparkAddresses {
  [diversifier: string]: string;
}

export interface SparkMint {
  txid: string;
  nHeight: number;
  nId: number;
  isUsed: boolean;
  lTagHash: string;
  memo: string;
  scriptPubKey: string;
  amount: number;
}

export interface SparkSpend {
  txid: string;
  lTagHash: string;
  lTag: string;
  amount: number;
}

export interface UnspentSparkMint {
  txid: string;
  nHeight: number;
  memo: string;
  scriptPubKey: string;
  amount: number;
  coin: string;
}

export interface IdentifySparkCoinsResult {
  'Old availableBalance': number;
  'Old unconfirmedBalance': number;
  'Old fullBalance': number;
  availableBalance: number;
  unconfirmedBalance: number;
  fullBalance: number;
}

export interface SparkCoinAddress {
  address: string;
  memo: string;
  amount: number;
}

export interface SparkMintRecipient {
  amount: number;
  memo?: string;
}

export interface SparkMintRecipients {
  [sparkAddress: string]: SparkMintRecipient;
}

export interface MempoolSparkTxs {
  [txid: string]: unknown;
}
