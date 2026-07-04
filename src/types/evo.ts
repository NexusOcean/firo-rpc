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

export type QuorumRecoveredSig = unknown;

export interface EvozNodeInfo {
  proTxHash: string;
  address: string;
  payee: string;
  status: string;
  lastpaidtime: number;
  lastpaidblock: number;
  owneraddress: string;
  votingaddress: string;
  collateraladdress: string;
  pubkeyoperator: string;
}

export type EvozNodeList = Record<string, EvozNodeInfo>;

export interface EvozNodeCount {
  total: number;
  enabled: number;
}

export interface EvozNodeHeightInfo {
  height: number;
  'IP:port': string;
  proTxHash: string;
  outpoint: string;
  payee: string;
}

export type EvozNodeWinners = Record<string, string>;

export interface BlsKeyPair {
  secret: string;
  public: string;
}

export interface SporkList {
  blockchain: unknown[];
  mempool: unknown[];
}

export interface EvozNodeSyncStatus {
  AssetID: number;
  AssetName: string;
  AssetStartTime: number;
  Attempt: number;
  IsBlockchainSynced: boolean;
  IsSynced: boolean;
  IsFailed: boolean;
}
