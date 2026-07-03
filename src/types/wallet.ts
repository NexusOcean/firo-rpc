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
  | 'orphan'
  | 'spend'
  | 'mint';
export interface WalletTransactionDetail {
  account: string;
  address?: string;
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

export type AddressGroupingEntry = [string, number, string?];

export type AddressGrouping = AddressGroupingEntry[][];

export type AddressBalances = Record<string, number>;

export interface LockedUnspent {
  txid: string;
  vout: number;
}

export interface ReceivedByAddressEntry {
  address: string;
  amount: number;
  confirmations: number;
  label?: string;
  /** @deprecated legacy account field, always "" — do not use */
  account?: string;
  txids?: string[];
}

export interface SendTransparentRecipientOptions {
  amount: number;
  subtractFee?: boolean;
  memo?: string;
  comment?: string;
  comment_to?: string;
}

export type SendTransparentRecipients = Record<
  string,
  SendTransparentRecipientOptions
>;

export interface BumpFeeOptions {
  confTarget?: number;
  totalFee?: number;
  replaceable?: boolean;
}

export interface BumpFeeResult {
  txid: string;
  origfee: number;
  fee: number;
  errors: string[];
}

export interface UnspentOutputRef {
  txid: string;
  vout: number;
}

export interface ImportMultiRequest {
  scriptPubKey: string | { address: string };
  timestamp: number | 'now';
  redeemscript?: string;
  pubkeys?: string[];
  keys?: string[];
  internal?: boolean;
  watchonly?: boolean;
  label?: string;
}

export interface ImportMultiOptions {
  rescan?: boolean;
}

export interface ImportMultiResult {
  success: boolean;
  error?: { code: number; message: string };
}
