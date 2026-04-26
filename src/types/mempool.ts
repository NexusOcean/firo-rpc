export interface MempoolInfo {
  size: number;
  bytes: number;
  usage: number;
  maxmempool: number;
  mempoolminfee: number;
  instantsendlocks: number;
}

export interface MempoolEntry {
  size: number;
  fee: number;
  modifiedfee: number;
  time: number;
  height: number;
  startingpriority: number;
  currentpriority: number;
  descendantcount: number;
  descendantsize: number;
  descendantfees: number;
  ancestorcount: number;
  ancestorsize: number;
  ancestorfees: number;
  depends: string[];
  instantlock: boolean;
}

export type RawMempool = Record<string, MempoolEntry>;
