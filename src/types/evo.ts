export type ProTxList = string[];

export interface ProTxState {
  service: string;
  registeredHeight: number;
  lastPaidHeight: number;
  PoSePenalty: number;
  PoSeRevivedHeight: number;
  PoSeBanHeight: number;
  revocationReason: number;
  ownerAddress: string;
  votingAddress: string;
  payoutAddress: string;
  pubKeyOperator: string;
}

export interface ProTxWallet {
  hasOwnerKey: boolean;
  hasOperatorKey: boolean;
  hasVotingKey: boolean;
  ownsCollateral: boolean;
  ownsPayeeScript: boolean;
  ownsOperatorRewardScript: boolean;
}

export interface ProTxInfo {
  proTxHash: string;
  collateralHash: string;
  collateralIndex: number;
  collateralAddress: string;
  operatorReward: number;
  state: ProTxState;
  confirmations: number;
  wallet: ProTxWallet;
}

export interface ProTxDiffMNListEntry {
  proRegTxHash: string;
  confirmedHash: string;
  service: string;
  pubKeyOperator: string;
  votingAddress: string;
  isValid: boolean;
}

export interface ProTxDiffQuorumRef {
  llmqType: number;
  quorumHash: string;
}

export interface ProTxDiffNewQuorum extends ProTxDiffQuorumRef {
  version: number;
  signersCount: number;
  validMembersCount: number;
  quorumPublicKey: string;
}

export interface ProTxDiff {
  baseBlockHash: string;
  blockHash: string;
  cbTxMerkleTree: string;
  cbTx: string;
  deletedMNs: string[];
  mnList: ProTxDiffMNListEntry[];
  deletedQuorums: ProTxDiffQuorumRef[];
  newQuorums: ProTxDiffNewQuorum[];
  merkleRootMNList: string;
  merkleRootQuorums: string;
}

export type QuorumList = Record<string, string[]>;

export interface QuorumMember {
  proTxHash: string;
  valid: boolean;
}

export interface QuorumInfo {
  height: number;
  type: string;
  quorumHash: string;
  minedBlock: string;
  members: QuorumMember[];
  quorumPublicKey: string;
}

export interface QuorumMinableCommitment {
  version: number;
  llmqType: number;
  quorumHash: string;
  signersCount: number;
  validMembersCount: number;
  quorumPublicKey: string;
}

/**
 Typed loosely as a record; revisit if a populated session is captured.
 */
export interface QuorumDkgStatus {
  time: number;
  timeStr: string;
  session: Record<string, unknown>;
  minableCommitments: Record<string, QuorumMinableCommitment>;
}

export interface QuorumMembership {
  height: number;
  type: string;
  quorumHash: string;
  minedBlock: string;
  quorumPublicKey: string;
  isValidMember: boolean;
  memberIndex: number;
}

export type QuorumMemberOf = QuorumMembership[];

/**
 * Typed from the `quorum getrecsig` usage string only. Revisit once a valid
 * sample response is available.
 */
export type QuorumRecoveredSig = unknown;
