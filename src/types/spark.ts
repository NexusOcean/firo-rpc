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
