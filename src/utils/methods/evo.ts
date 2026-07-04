import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type {
  ProTxList,
  ProTxInfo,
  ProTxDiff,
  QuorumList,
  QuorumInfo,
  QuorumDkgStatus,
  QuorumMemberOf,
  QuorumRecoveredSig,
  EvozNodeList,
  EvozNodeCount,
  EvozNodeHeightInfo,
  EvozNodeWinners,
  BlsKeyPair,
  SporkList,
  EvozNodeSyncStatus,
} from '../../types/index.js';

export interface EvoMethods {
  protxList(): Promise<ProTxList>;
  protxInfo(proTxHash: string): Promise<ProTxInfo>;
  protxDiff(baseBlock: number, block: number): Promise<ProTxDiff>;
  quorumList(): Promise<QuorumList>;
  quorumInfo(
    llmqType: number,
    quorumHash: string,
    includeSkShare?: boolean,
  ): Promise<QuorumInfo>;
  quorumDkgStatus(): Promise<QuorumDkgStatus>;
  quorumMemberOf(
    proTxHash: string,
    scanQuorumsCount?: number,
  ): Promise<QuorumMemberOf>;
  quorumGetRecSig(
    llmqType: number,
    id: string,
    msgHash: string,
  ): Promise<QuorumRecoveredSig>;
  quorumHasRecSig(
    llmqType: number,
    id: string,
    msgHash: string,
  ): Promise<boolean>;
  quorumIsConflicting(
    llmqType: number,
    id: string,
    msgHash: string,
  ): Promise<boolean>;
  evoznodeList(): Promise<EvozNodeList>;
  evoznodeCount(): Promise<EvozNodeCount>;
  evoznodeCurrent(): Promise<EvozNodeHeightInfo>;
  evoznodeWinner(): Promise<EvozNodeHeightInfo>;
  evoznodeWinners(): Promise<EvozNodeWinners>;
  blsGenerate(): Promise<BlsKeyPair>;
  blsFromSecret(secret: string): Promise<BlsKeyPair>;
  sporkList(): Promise<SporkList>;
  evoznsyncStatus(): Promise<EvozNodeSyncStatus>;
}

export function createEvoMethods(http: AxiosInstance): EvoMethods {
  return {
    protxList: () => callRpc<ProTxList>(http, 'protx', ['list']),

    protxInfo: (proTxHash: string) =>
      callRpc<ProTxInfo>(http, 'protx', ['info', proTxHash]),

    protxDiff: (baseBlock: number, block: number) =>
      callRpc<ProTxDiff>(http, 'protx', [
        'diff',
        String(baseBlock),
        String(block),
      ]),

    quorumList: () => callRpc<QuorumList>(http, 'quorum', ['list']),

    quorumInfo: (
      llmqType: number,
      quorumHash: string,
      includeSkShare = false,
    ) =>
      callRpc<QuorumInfo>(http, 'quorum', [
        'info',
        llmqType,
        quorumHash,
        includeSkShare,
      ]),

    quorumDkgStatus: () =>
      callRpc<QuorumDkgStatus>(http, 'quorum', ['dkgstatus']),

    quorumMemberOf: (proTxHash: string, scanQuorumsCount?: number) =>
      callRpc<QuorumMemberOf>(
        http,
        'quorum',
        scanQuorumsCount !== undefined
          ? ['memberof', proTxHash, scanQuorumsCount]
          : ['memberof', proTxHash],
      ),

    quorumGetRecSig: (llmqType: number, id: string, msgHash: string) =>
      callRpc<QuorumRecoveredSig>(http, 'quorum', [
        'getrecsig',
        llmqType,
        id,
        msgHash,
      ]),

    quorumHasRecSig: (llmqType: number, id: string, msgHash: string) =>
      callRpc<boolean>(http, 'quorum', ['hasrecsig', llmqType, id, msgHash]),

    quorumIsConflicting: (llmqType: number, id: string, msgHash: string) =>
      callRpc<boolean>(http, 'quorum', [
        'isconflicting',
        llmqType,
        id,
        msgHash,
      ]),

    evoznodeList: () => callRpc<EvozNodeList>(http, 'evoznode', ['list']),

    evoznodeCount: () => callRpc<EvozNodeCount>(http, 'evoznode', ['count']),

    evoznodeCurrent: () =>
      callRpc<EvozNodeHeightInfo>(http, 'evoznode', ['current']),

    evoznodeWinner: () =>
      callRpc<EvozNodeHeightInfo>(http, 'evoznode', ['winner']),

    evoznodeWinners: () =>
      callRpc<EvozNodeWinners>(http, 'evoznode', ['winners']),

    blsGenerate: () => callRpc<BlsKeyPair>(http, 'bls', ['generate']),

    blsFromSecret: (secret: string) =>
      callRpc<BlsKeyPair>(http, 'bls', ['fromsecret', secret]),

    sporkList: () => callRpc<SporkList>(http, 'spork', ['list']),

    evoznsyncStatus: () =>
      callRpc<EvozNodeSyncStatus>(http, 'evoznsync', ['status']),
  };
}
