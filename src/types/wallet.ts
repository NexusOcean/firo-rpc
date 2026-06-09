export interface WalletInfo {
  walletversion: number;
  balance: number;
  unconfirmed_balance: number;
  immature_balance: number;
  txcount: number;
  keypoololdest: number;
  keypoolsize: number;
  keypoolsize_hd_internal?: number;
  paytxfee: number;
  hdmasterkeyid?: string;
  unlocked_until?: number;
}

export interface ValidateAddressResult {
  isvalid: boolean;
  address?: string;
  scriptPubKey?: string;
  ismine?: boolean;
  iswatchonly?: boolean;
  isscript?: boolean;
  pubkey?: string;
  iscompressed?: boolean;
  account?: string;
  timestamp?: number;
  hdkeypath?: string;
  hdmasterkeyid?: string;
}

export type WalletTxCategory =
  | 'send'
  | 'receive'
  | 'generate'
  | 'immature'
  | 'orphan';

export interface WalletTransactionDetail {
  account: string;
  address: string;
  category: WalletTxCategory;
  amount: number;
  label?: string;
  vout: number;
  fee?: number;
  abandoned?: boolean;
}

export interface WalletTransactionListEntry extends WalletTransactionDetail {
  confirmations: number;
  instantlock: boolean;
  chainlock: boolean;
  blockhash?: string;
  blockindex?: number;
  blocktime?: number;
  txid: string;
  walletconflicts: string[];
  time: number;
  timereceived: number;
  'bip125-replaceable': 'yes' | 'no' | 'unknown';
  comment?: string;
  to?: string;
}

export interface WalletTransaction {
  amount: number;
  fee?: number;
  confirmations: number;
  instantlock: boolean;
  chainlock: boolean;
  generated?: boolean;
  blockhash?: string;
  blockindex?: number;
  blocktime?: number;
  txid: string;
  walletconflicts: string[];
  time: number;
  timereceived: number;
  'bip125-replaceable': 'yes' | 'no' | 'unknown';
  details: WalletTransactionDetail[];
  hex: string;
  comment?: string;
  to?: string;
}

export interface ListSinceBlockResult {
  transactions: WalletTransactionListEntry[];
  removed?: WalletTransactionListEntry[];
  lastblock: string;
}
