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
  /**
   * Return shape UNCONFIRMED against live data — see {@link QuorumRecoveredSig}.
   */
  quorumGetRecSig(
    llmqType: number,
    id: string,
    msgHash: string,
  ): Promise<QuorumRecoveredSig>;
  /**
   * NOT confirmed against a live response, since no
   * valid id/msgHash pair was available to test with.
   */
  quorumHasRecSig(
    llmqType: number,
    id: string,
    msgHash: string,
  ): Promise<boolean>;
  /**
   * NOT confirmed against a live response, since no valid
   * id/msgHash pair was available to test with.
   */
  quorumIsConflicting(
    llmqType: number,
    id: string,
    msgHash: string,
  ): Promise<boolean>;
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
  };
}
