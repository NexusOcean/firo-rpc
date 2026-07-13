import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type {
  SparkAnonymitySet,
  SparkAnonymitySetSector,
  SparkAnonymitySetMeta,
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
} from '../../types/index.js';

export interface SparkMethods {
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
  getSparkNames(fOnlyOwn?: boolean): Promise<SparkName[]>;
  getSparkNameData(sparkname: string): Promise<SparkNameData>;
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
  getNewSparkAddress(): Promise<string[]>;
  getAllSparkAddresses(): Promise<SparkAddresses>;
  getSparkDefaultAddress(): Promise<string[]>;
  getSparkBalance(): Promise<SparkAddressBalance>;
  getSparkAddressBalance(address: string): Promise<SparkAddressBalance>;
  getTotalBalance(): Promise<number>;
  getPrivateBalance(): Promise<number>;
  dumpSparkViewKey(): Promise<string>;
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
}

export function createSparkMethods(http: AxiosInstance): SparkMethods {
  return {
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

    getNewSparkAddress: () => callRpc<string[]>(http, 'getnewsparkaddress'),

    getAllSparkAddresses: () =>
      callRpc<SparkAddresses>(http, 'getallsparkaddresses'),

    getSparkDefaultAddress: () =>
      callRpc<string[]>(http, 'getsparkdefaultaddress'),

    getSparkBalance: () =>
      callRpc<SparkAddressBalance>(http, 'getsparkbalance', []),

    getSparkAddressBalance: async (
      address: string,
    ): Promise<SparkAddressBalance> => {
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

    sendSpark: (recipients: SparkSendRecipients) =>
      callRpc<string>(http, 'sendspark', [recipients]),

    getMempoolSparkTxs: (txids: string[]) =>
      callRpc<MempoolSparkTxs>(http, 'getmempoolsparktxs', [{ txids }]),
  };
}
