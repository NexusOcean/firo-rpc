import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type {
  WalletInfo,
  ValidateAddressResult,
  WalletTransaction,
  WalletTransactionListEntry,
  ListSinceBlockResult,
  UnspentOutput,
  AddressGrouping,
  AddressBalances,
  LockedUnspent,
  ReceivedByAddressEntry,
  SendTransparentRecipients,
  BumpFeeOptions,
  BumpFeeResult,
  UnspentOutputRef,
  ImportMultiRequest,
  ImportMultiOptions,
  ImportMultiResult,
  SparkSendRecipients,
} from '../../types/index.js';

export interface WalletMethods {
  getWalletInfo(): Promise<WalletInfo>;
  getBalance(minconf?: number): Promise<number>;
  getUnconfirmedBalance(): Promise<number>;
  getNewAddress(label?: string): Promise<string>;
  validateAddress(address: string): Promise<ValidateAddressResult>;
  getTransaction(txid: string): Promise<WalletTransaction>;
  listTransactions(
    label?: string,
    count?: number,
    skip?: number,
  ): Promise<WalletTransactionListEntry[]>;
  listSinceBlock(
    blockhash?: string,
    targetConfirmations?: number,
    includeWatchOnly?: boolean,
  ): Promise<ListSinceBlockResult>;
  listUnspent(
    minconf?: number,
    maxconf?: number,
    addresses?: string[],
    includeUnsafe?: boolean,
  ): Promise<UnspentOutput[]>;
  sendToAddress(
    address: string,
    amount: number,
    comment?: string,
    commentTo?: string,
    subtractFeeFromAmount?: boolean,
  ): Promise<string>;
  getReceivedByAddress(address: string, minconf?: number): Promise<number>;
  importAddress(
    address: string,
    label?: string,
    rescan?: boolean,
    p2sh?: boolean,
  ): Promise<void>;
  getRawChangeAddress(): Promise<string>;
  listAddressBalances(minAmount?: number): Promise<AddressBalances>;
  listAddressGroupings(): Promise<AddressGrouping>;
  listLockUnspent(): Promise<LockedUnspent[]>;
  listReceivedByAddress(
    minconf?: number,
    includeEmpty?: boolean,
    includeWatchOnly?: boolean,
  ): Promise<ReceivedByAddressEntry[]>;
  setMinInput(amount: number): Promise<boolean>;
  setTxFee(amount: number): Promise<boolean>;
  // dumpprivkey requires a one-time confirmation code, undocumented in CLI help.
  // First call (no code) always errors with the code embedded in the error message;
  // second call (address + code) returns the key. Caller is responsible for the flow.
  dumpPrivKey(address: string, code?: string): Promise<string>;
  importPrivKey(
    privKey: string,
    label?: string,
    rescan?: boolean,
  ): Promise<void>;
  importPubKey(pubKey: string, label?: string, rescan?: boolean): Promise<void>;
  signMessage(address: string, message: string): Promise<string>;
  signMessageWithSparkAddress(
    sparkAddress: string,
    message: string,
  ): Promise<string>;
  lockUnspent(
    unlock: boolean,
    transactions?: UnspentOutputRef[],
  ): Promise<boolean>;
  // fromaccount is a legacy positional param — hardcoded to '', not exposed.
  sendMany(
    recipients: Record<string, number>,
    minconf?: number,
    comment?: string,
    subtractFeeFrom?: string[],
  ): Promise<string>;
  sendTransparent(
    address: string,
    amount: number,
    comment?: string,
    commentTo?: string,
    subtractFeeFromAmount?: boolean,
  ): Promise<string>;
  sendTransparentMany(
    recipients: SendTransparentRecipients,
  ): Promise<string | string[]>;
  bumpFee(txid: string, options?: BumpFeeOptions): Promise<BumpFeeResult>;
  // fromaccount is a legacy positional param — hardcoded to '', not exposed.
  sendSparkMany(
    recipients: Record<string, number>,
    comment?: string,
    subtractFeeFrom?: string[],
  ): Promise<string>;
  spendSpark(recipients: SparkSendRecipients): Promise<string>;
  importMulti(
    requests: ImportMultiRequest[],
    options?: ImportMultiOptions,
  ): Promise<ImportMultiResult[]>;
  abandonTransaction(txid: string): Promise<void>;
}

export function createWalletMethods(http: AxiosInstance): WalletMethods {
  return {
    getWalletInfo(): Promise<WalletInfo> {
      return callRpc<WalletInfo>(http, 'getwalletinfo', []);
    },

    getBalance(minconf: number = 1): Promise<number> {
      return callRpc<number>(http, 'getbalance', ['*', minconf]);
    },

    getUnconfirmedBalance(): Promise<number> {
      return callRpc<number>(http, 'getunconfirmedbalance', []);
    },

    getNewAddress(label?: string): Promise<string> {
      return callRpc<string>(
        http,
        'getnewaddress',
        label !== undefined ? [label] : [],
      );
    },

    validateAddress(address: string): Promise<ValidateAddressResult> {
      return callRpc<ValidateAddressResult>(http, 'validateaddress', [address]);
    },

    getTransaction(txid: string): Promise<WalletTransaction> {
      return callRpc<WalletTransaction>(http, 'gettransaction', [txid]);
    },

    listTransactions(
      label: string = '*',
      count: number = 10,
      skip: number = 0,
    ): Promise<WalletTransactionListEntry[]> {
      return callRpc<WalletTransactionListEntry[]>(http, 'listtransactions', [
        label,
        count,
        skip,
      ]);
    },

    listSinceBlock(
      blockhash?: string,
      targetConfirmations: number = 1,
      includeWatchOnly: boolean = false,
    ): Promise<ListSinceBlockResult> {
      const params: unknown[] = [];
      if (blockhash !== undefined) {
        params.push(blockhash, targetConfirmations, includeWatchOnly);
      }
      return callRpc<ListSinceBlockResult>(http, 'listsinceblock', params);
    },

    listUnspent: (
      minconf = 1,
      maxconf = 9999999,
      addresses,
      includeUnsafe = true,
    ) =>
      callRpc<UnspentOutput[]>(http, 'listunspent', [
        minconf,
        maxconf,
        addresses ?? [],
        includeUnsafe,
      ]),

    sendToAddress(
      address: string,
      amount: number,
      comment?: string,
      commentTo?: string,
      subtractFeeFromAmount: boolean = false,
    ): Promise<string> {
      const params: unknown[] = [address, amount];
      if (
        comment !== undefined ||
        commentTo !== undefined ||
        subtractFeeFromAmount
      ) {
        params.push(comment ?? '', commentTo ?? '', subtractFeeFromAmount);
      }
      return callRpc<string>(http, 'sendtoaddress', params);
    },

    getReceivedByAddress(
      address: string,
      minconf: number = 1,
    ): Promise<number> {
      return callRpc<number>(http, 'getreceivedbyaddress', [address, minconf]);
    },

    importAddress: (address, label = '', rescan = true, p2sh = false) =>
      callRpc<void>(http, 'importaddress', [address, label, rescan, p2sh]),

    getRawChangeAddress: () => callRpc<string>(http, 'getrawchangeaddress'),

    listAddressBalances: (minAmount = 0) =>
      callRpc<AddressBalances>(http, 'listaddressbalances', [minAmount]),

    listAddressGroupings: () =>
      callRpc<AddressGrouping>(http, 'listaddressgroupings'),

    listLockUnspent: () => callRpc<LockedUnspent[]>(http, 'listlockunspent'),

    listReceivedByAddress: (
      minconf = 1,
      includeEmpty = false,
      includeWatchOnly = false,
    ) =>
      callRpc<ReceivedByAddressEntry[]>(http, 'listreceivedbyaddress', [
        minconf,
        includeEmpty,
        includeWatchOnly,
      ]),

    setMinInput: (amount: number) =>
      callRpc<boolean>(http, 'setmininput', [amount]),

    setTxFee: (amount: number) => callRpc<boolean>(http, 'settxfee', [amount]),

    dumpPrivKey: (address: string, code?: string) =>
      callRpc<string>(
        http,
        'dumpprivkey',
        code !== undefined ? [address, code] : [address],
      ),

    importPrivKey: (privKey: string, label = '', rescan = true) =>
      callRpc<void>(http, 'importprivkey', [privKey, label, rescan]),

    importPubKey: (pubKey: string, label = '', rescan = true) =>
      callRpc<void>(http, 'importpubkey', [pubKey, label, rescan]),

    signMessage: (address: string, message: string) =>
      callRpc<string>(http, 'signmessage', [address, message]),

    signMessageWithSparkAddress: (sparkAddress: string, message: string) =>
      callRpc<string>(http, 'signmessagewithsparkaddress', [
        sparkAddress,
        message,
      ]),

    lockUnspent: (unlock: boolean, transactions: UnspentOutputRef[] = []) =>
      callRpc<boolean>(http, 'lockunspent', [unlock, transactions]),

    // fromaccount is a legacy positional param — hardcoded to '', not exposed.
    sendMany: (
      recipients: Record<string, number>,
      minconf = 1,
      comment = '',
      subtractFeeFrom: string[] = [],
    ) =>
      callRpc<string>(http, 'sendmany', [
        '',
        recipients,
        minconf,
        comment,
        subtractFeeFrom,
      ]),

    sendTransparent: (
      address: string,
      amount: number,
      comment?: string,
      commentTo?: string,
      subtractFeeFromAmount = false,
    ) =>
      callRpc<string>(http, 'sendtransparent', [
        address,
        amount,
        comment ?? '',
        commentTo ?? '',
        subtractFeeFromAmount,
      ]),

    sendTransparentMany: (recipients: SendTransparentRecipients) =>
      callRpc<string | string[]>(http, 'sendtransparent', [recipients]),

    bumpFee: (txid: string, options: BumpFeeOptions = {}) =>
      callRpc<BumpFeeResult>(http, 'bumpfee', [txid, options]),

    // fromaccount is a legacy positional param — hardcoded to '', not exposed.
    sendSparkMany: (
      recipients: Record<string, number>,
      comment = '',
      subtractFeeFrom: string[] = [],
    ) =>
      callRpc<string>(http, 'sendsparkmany', [
        '',
        recipients,
        comment,
        subtractFeeFrom,
      ]),

    spendSpark: (recipients: SparkSendRecipients) =>
      callRpc<string>(http, 'spendspark', [recipients]),

    importMulti: (
      requests: ImportMultiRequest[],
      options: ImportMultiOptions = {},
    ) => callRpc<ImportMultiResult[]>(http, 'importmulti', [requests, options]),

    abandonTransaction: (txid: string) =>
      callRpc<void>(http, 'abandontransaction', [txid]),
  };
}
