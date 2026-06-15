export interface FeeRate {
  /** Fee rate in satoshis per kB. */
  rate: number;
}

export interface SmartFeeEstimate {
  /** Fee rate in FIRO/kB.  */
  feerate: number;
  blocks: number;
}

export interface SmartPriorityEstimate {
  priority: number;
  blocks: number;
}
