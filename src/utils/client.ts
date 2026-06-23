import { buildHttpClient } from './http.js';
import { callRpc, callRpcBatch } from './rpc.js';
import type {
  RpcConfig,
  BatchCall,
  BatchResult,
  Block,
  BlockchainInfo,
  Transaction,
  TxOutSetInfo,
  NetworkInfo,
  PeerInfo,
  MempoolInfo,
  MempoolEntry,
  RawMempool,
  FiroAddressBalance,
  FiroAddressTxIds,
  WalletInfo,
  ValidateAddressResult,
  WalletTransaction,
  WalletTransactionListEntry,
  ListSinceBlockResult,
  BlockHeader,
  TxOut,
  UnspentOutput,
  SparkAnonymitySet,
  SparkAnonymitySetSector,
  SparkAnonymitySetMeta,
  FeeRate,
  SmartFeeEstimate,
  SmartPriorityEstimate,
  SparkName,
  SparkNameData,
  SparkSendRecipients,
  SparkAddressBalance,
  UsedCoinsTags,
  SparkAddresses,
  SparkMint,
  SparkSpend,
  UnspentSparkMint,
  IdentifySparkCoinsResult,
  SparkCoinAddress,
  SparkMintRecipients,
  MempoolSparkTxs,
} from '../types/index.js';

export interface FiroRpcClient {
  call<T = unknown>(method: string, ...params: unknown[]): Promise<T>;
  batch(calls: BatchCall[]): Promise<BatchResult[]>;

  // blockchain
  getBlockCount(): Promise<number>;
  getBlockHash(height: number): Promise<string>;
  getBestBlockHash(): Promise<string>;
  getBlock(hash: string): Promise<Block>;
  getBlockHeader(hash: string): Promise<BlockHeader>;
  getBlockHeader(hash: string, verbose: true): Promise<BlockHeader>;
  getBlockHeader(hash: string, verbose: false): Promise<string>;
  getBlockchainInfo(): Promise<BlockchainInfo>;
  getTxOutSetInfo(): Promise<TxOutSetInfo>;
  getTxOut(
    txid: string,
    n: number,
    includeMempool?: boolean,
  ): Promise<TxOut | null>;
  getRawTransaction(txid: string): Promise<Transaction>;
  getRawTransaction(txid: string, verbose: true): Promise<Transaction>;
  getRawTransaction(txid: string, verbose: false): Promise<string>;
  getMempoolInfo(): Promise<MempoolInfo>;
  getRawMempool(): Promise<RawMempool>;
  getRawMempool(verbose: true): Promise<RawMempool>;
  getRawMempool(verbose: false): Promise<string[]>;
  getMempoolEntry(txid: string): Promise<MempoolEntry>;

  // network
  getNetworkInfo(): Promise<NetworkInfo>;
  getPeerInfo(): Promise<PeerInfo[]>;

  // wallet
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

  // spark - anonymity set & mempool
  getSparkLatestCoinId(): Promise<number>;
  getSparkAnonymitySet(
    coinGroupId: number,
    startBlockHash: string,
  ): Promise<SparkAnonymitySet>;
  getSparkAnonymitySetMeta(coinGroupId: number): Promise<SparkAnonymitySetMeta>;
  getSparkAnonymitySetSector(
    coinGroupId: number,
    latestBlock: string,
    startIndex: number,
    endIndex: number,
  ): Promise<SparkAnonymitySetSector>;
  getMempoolSparkTxIds(): Promise<string[]>;

  // spark - names
  getSparkNames(fOnlyOwn?: boolean): Promise<SparkName[]>;
  getSparkNameData(sparkname: string): Promise<SparkNameData>;
  /*
   * Returns Spark name registration details for a given tx hash.
   * Requires a Spark name registration tx hash — regular txids and lTagHashes are rejected.
   * NOTE: only available via direct firod RPC; not supported on ElectrumX nodes.
   */
  getSparkNameTxDetails(txid: string): Promise<SparkName>;
  registerSparkName(
    name: string,
    sparkAddress: string,
    years: number,
    additionalData?: string,
  ): Promise<string>;
  requestSparkNameTransfer(
    name: string,
    newSparkAddress: string,
    years: number,
    oldSparkAddress: string,
    additionalData?: string,
  ): Promise<string>;
  transferSparkName(
    oldSparkAddress: string,
    requestHash: string,
  ): Promise<string>;

  // spark - balances & addresses
  getNewSparkAddress(): Promise<string[]>;
  getAllSparkAddresses(): Promise<SparkAddresses>;
  getSparkDefaultAddress(): Promise<string[]>;
  getSparkBalance(): Promise<SparkAddressBalance>;
  getSparkAddressBalance(address: string): Promise<SparkAddressBalance>;
  getTotalBalance(): Promise<number>;
  getPrivateBalance(): Promise<number>;
  dumpSparkViewKey(): Promise<string>;

  // spark - mints & spends
  getUsedCoinsTags(startIndex: number): Promise<UsedCoinsTags>;
  listSparkMints(): Promise<SparkMint[]>;
  listSparkSpends(): Promise<SparkSpend[]>;
  listUnspentSparkMints(): Promise<UnspentSparkMint[]>;
  identifySparkCoins(txid: string): Promise<IdentifySparkCoinsResult>;
  getSparkCoinAddr(txid: string): Promise<SparkCoinAddress[]>;
  setSparkMintStatus(lTagHash: string, isUsed: boolean): Promise<null>;
  mintSpark(
    recipients: SparkMintRecipients,
    subtractFeeFromAmount?: string[],
  ): Promise<string[]>;
  autoMintSpark(): Promise<string[]>;
  resetSparkMints(): Promise<null>;
  /**
   * Send Spark to one or more recipients.
   *
   * NOTE: firod returns a txid as soon as the transaction is constructed
   * and signed — this does not guarantee the transaction broadcast
   * successfully. Verify with getTransaction(txid) (check `confirmations`
   * and `trusted`) before treating a send as final.
   */
  sendSpark(recipients: SparkSendRecipients): Promise<string>;
  getMempoolSparkTxs(txids: string[]): Promise<MempoolSparkTxs>;
  /**
   * Returns metadata for the given Spark mint coin hashes.
   * Pass an array of coin hashes from the anonymity set (not lTagHash).
   * Returns empty array if no matches found.
   * @see getsparkanonymityset to obtain valid coin hashes
   */
  getSparkMintMetadata(coinHashes: string[]): Promise<unknown[]>;

  // address index (requires -addressindex on your node)
  getAddressBalance(address: string): Promise<FiroAddressBalance>;
  getAddressTxIds(address: string): Promise<FiroAddressTxIds>;

  // fees
  getFeeRate(): Promise<FeeRate>;
  estimateFee(nblocks: number): Promise<number>;
  estimateSmartFee(nblocks: number): Promise<SmartFeeEstimate>;
  estimatePriority(nblocks: number): Promise<number>;
  estimateSmartPriority(nblocks: number): Promise<SmartPriorityEstimate>;
}

export function createFiroRpcClient(config: RpcConfig): FiroRpcClient {
  const http = buildHttpClient(config);

  return {
    call<T = unknown>(method: string, ...params: unknown[]): Promise<T> {
      return callRpc<T>(http, method, params);
    },
    batch(calls: BatchCall[]): Promise<BatchResult[]> {
      return callRpcBatch(http, calls);
    },

    // blockchain
    getBlockCount(): Promise<number> {
      return callRpc<number>(http, 'getblockcount', []);
    },

    getBlockHash(height: number): Promise<string> {
      return callRpc<string>(http, 'getblockhash', [height]);
    },

    getBestBlockHash: () => callRpc<string>(http, 'getbestblockhash'),

    getBlock(hash: string): Promise<Block> {
      return callRpc<Block>(http, 'getblock', [hash, 2]);
    },

    getBlockHeader: ((hash: string, verbose: boolean = true) =>
      callRpc<BlockHeader | string>(http, 'getblockheader', [
        hash,
        verbose,
      ])) as FiroRpcClient['getBlockHeader'],

    getBlockchainInfo(): Promise<BlockchainInfo> {
      return callRpc<BlockchainInfo>(http, 'getblockchaininfo', []);
    },

    getTxOutSetInfo(): Promise<TxOutSetInfo> {
      return callRpc<TxOutSetInfo>(http, 'gettxoutsetinfo', []);
    },

    getTxOut: (txid, n, includeMempool = true) =>
      callRpc<TxOut | null>(http, 'gettxout', [txid, n, includeMempool]),

    getRawTransaction: ((txid: string, verbose: boolean = true) =>
      callRpc<Transaction | string>(http, 'getrawtransaction', [
        txid,
        verbose,
      ])) as FiroRpcClient['getRawTransaction'],

    getMempoolInfo(): Promise<MempoolInfo> {
      return callRpc<MempoolInfo>(http, 'getmempoolinfo', []);
    },

    getRawMempool: ((verbose: boolean = true) =>
      callRpc<RawMempool | string[]>(http, 'getrawmempool', [
        verbose,
      ])) as FiroRpcClient['getRawMempool'],

    getMempoolEntry(txid: string): Promise<MempoolEntry> {
      return callRpc<MempoolEntry>(http, 'getmempoolentry', [txid]);
    },

    // network
    getNetworkInfo(): Promise<NetworkInfo> {
      return callRpc<NetworkInfo>(http, 'getnetworkinfo', []);
    },

    getPeerInfo(): Promise<PeerInfo[]> {
      return callRpc<PeerInfo[]>(http, 'getpeerinfo', []);
    },

    // wallet
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

    // spark - anonymity set & mempool
    getSparkLatestCoinId: () => callRpc<number>(http, 'getsparklatestcoinid'),

    getSparkAnonymitySet: (coinGroupId: number, startBlockHash: string) =>
      callRpc<SparkAnonymitySet>(http, 'getsparkanonymityset', [
        String(coinGroupId),
        startBlockHash,
      ]),

    getSparkAnonymitySetMeta: (coinGroupId: number) =>
      callRpc<SparkAnonymitySetMeta>(http, 'getsparkanonymitysetmeta', [
        String(coinGroupId),
      ]),

    getSparkAnonymitySetSector: (
      coinGroupId: number,
      latestBlock: string,
      startIndex: number,
      endIndex: number,
    ) =>
      callRpc<SparkAnonymitySetSector>(http, 'getsparkanonymitysetsector', [
        String(coinGroupId),
        latestBlock,
        String(startIndex),
        String(endIndex),
      ]),

    getMempoolSparkTxIds: () => callRpc<string[]>(http, 'getmempoolsparktxids'),
    getSparkMintMetadata: (coinHashes: string[]) =>
      callRpc<unknown[]>(http, 'getsparkmintmetadata', [{ coinHashes }]),

    // spark - names
    getSparkNames: (fOnlyOwn = false) =>
      callRpc<SparkName[]>(http, 'getsparknames', [fOnlyOwn]),

    getSparkNameData: (sparkname: string) =>
      callRpc<SparkNameData>(http, 'getsparknamedata', [sparkname]),

    getSparkNameTxDetails: (txid: string) =>
      callRpc<SparkName>(http, 'getsparknametxdetails', [txid]),

    registerSparkName: (
      name: string,
      sparkAddress: string,
      years: number,
      additionalData?: string,
    ) =>
      callRpc<string>(
        http,
        'registersparkname',
        additionalData !== undefined
          ? [name, sparkAddress, years, additionalData]
          : [name, sparkAddress, years],
      ),

    requestSparkNameTransfer: (
      name: string,
      newSparkAddress: string,
      years: number,
      oldSparkAddress: string,
      additionalData?: string,
    ) =>
      callRpc<string>(
        http,
        'requestsparknametransfer',
        additionalData !== undefined
          ? [name, newSparkAddress, years, oldSparkAddress, additionalData]
          : [name, newSparkAddress, years, oldSparkAddress],
      ),

    transferSparkName: (oldSparkAddress: string, requestHash: string) =>
      callRpc<string>(http, 'transfersparkname', [
        oldSparkAddress,
        requestHash,
      ]),

    // spark - balances & addresses
    getNewSparkAddress: () => callRpc<string[]>(http, 'getnewsparkaddress'),

    getAllSparkAddresses: () =>
      callRpc<SparkAddresses>(http, 'getallsparkaddresses'),

    getSparkDefaultAddress: () =>
      callRpc<string[]>(http, 'getsparkdefaultaddress'),

    getSparkBalance: async () => {
      const raw = await callRpc<Record<string, number>>(
        http,
        'getsparkbalance',
        [],
      );
      return {
        availableBalance: raw['availableBalance: '] ?? 0,
        unconfirmedBalance: raw['unconfirmedBalance: '] ?? 0,
        fullBalance: raw['fullBalance: '] ?? 0,
      } as SparkAddressBalance;
    },

    getSparkAddressBalance: async (address: string) => {
      const raw = await callRpc<Record<string, number>>(
        http,
        'getsparkaddressbalance',
        [address],
      );
      return {
        availableBalance: raw['availableBalance: '] ?? 0,
        unconfirmedBalance: raw['unconfirmedBalance: '] ?? 0,
        fullBalance: raw['fullBalance: '] ?? 0,
      };
    },

    getTotalBalance: () => callRpc<number>(http, 'gettotalbalance'),

    getPrivateBalance: () => callRpc<number>(http, 'getprivatebalance'),

    dumpSparkViewKey: () => callRpc<string>(http, 'dumpsparkviewkey'),

    // spark - mints & spends
    getUsedCoinsTags(startIndex: number): Promise<UsedCoinsTags> {
      return callRpc<UsedCoinsTags>(http, 'getusedcoinstags', [
        String(startIndex),
      ]);
    },

    listSparkMints: () => callRpc<SparkMint[]>(http, 'listsparkmints'),

    listSparkSpends: () => callRpc<SparkSpend[]>(http, 'listsparkspends'),

    listUnspentSparkMints: () =>
      callRpc<UnspentSparkMint[]>(http, 'listunspentsparkmints'),

    identifySparkCoins: (txid: string) =>
      callRpc<IdentifySparkCoinsResult>(http, 'identifysparkcoins', [txid]),

    getSparkCoinAddr: (txid: string) =>
      callRpc<SparkCoinAddress[]>(http, 'getsparkcoinaddr', [txid]),

    setSparkMintStatus: (lTagHash: string, isUsed: boolean) =>
      callRpc<null>(http, 'setsparkmintstatus', [lTagHash, isUsed]),

    mintSpark: (
      recipients: SparkMintRecipients,
      subtractFeeFromAmount?: string[],
    ) =>
      callRpc<string[]>(http, 'mintspark', [
        recipients,
        subtractFeeFromAmount ?? [],
      ]),

    autoMintSpark: () => callRpc<string[]>(http, 'automintspark'),

    resetSparkMints: () => callRpc<null>(http, 'resetsparkmints'),

    // tx id can be created, but never broadcasted. does not confirm success.
    sendSpark: (recipients: SparkSendRecipients) =>
      callRpc<string>(http, 'sendspark', [recipients]),

    getMempoolSparkTxs: (txids: string[]) =>
      callRpc<MempoolSparkTxs>(http, 'getmempoolsparktxs', [{ txids }]),

    // address index
    getAddressBalance(address: string): Promise<FiroAddressBalance> {
      return callRpc<FiroAddressBalance>(http, 'getaddressbalance', [
        { addresses: [address] },
      ]);
    },

    getAddressTxIds(address: string): Promise<FiroAddressTxIds> {
      return callRpc<FiroAddressTxIds>(http, 'getaddresstxids', [
        { addresses: [address] },
      ]);
    },

    // fees
    getFeeRate: () => callRpc<FeeRate>(http, 'getfeerate'),

    estimateFee: (nblocks: number) =>
      callRpc<number>(http, 'estimatefee', [nblocks]),

    estimateSmartFee: (nblocks: number) =>
      callRpc<SmartFeeEstimate>(http, 'estimatesmartfee', [nblocks]),

    estimatePriority: (nblocks: number) =>
      callRpc<number>(http, 'estimatepriority', [nblocks]),

    estimateSmartPriority: (nblocks: number) =>
      callRpc<SmartPriorityEstimate>(http, 'estimatesmartpriority', [nblocks]),
  };
}
