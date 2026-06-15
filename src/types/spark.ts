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
