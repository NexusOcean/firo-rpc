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
