import { makeClient } from './setup.js';

const client = makeClient();

describe('protxList', () => {
  it('returns a non-empty array of ProTx hashes', async () => {
    const list = await client.protxList();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    for (const hash of list) {
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^[0-9a-f]+$/);
    }
  });
});

describe('protxInfo', () => {
  it('returns detailed state for a known ProTx hash', async () => {
    const [proTxHash] = await client.protxList();
    const info = await client.protxInfo(proTxHash!);

    expect(info.proTxHash).toBe(proTxHash);
    expect(typeof info.collateralHash).toBe('string');
    expect(typeof info.collateralIndex).toBe('number');
    expect(typeof info.collateralAddress).toBe('string');
    expect(typeof info.operatorReward).toBe('number');
    expect(typeof info.confirmations).toBe('number');

    expect(typeof info.state.service).toBe('string');
    expect(typeof info.state.registeredHeight).toBe('number');
    expect(typeof info.state.lastPaidHeight).toBe('number');
    expect(typeof info.state.ownerAddress).toBe('string');
    expect(typeof info.state.votingAddress).toBe('string');
    expect(typeof info.state.payoutAddress).toBe('string');
    expect(typeof info.state.pubKeyOperator).toBe('string');

    expect(typeof info.wallet.hasOwnerKey).toBe('boolean');
    expect(typeof info.wallet.hasOperatorKey).toBe('boolean');
    expect(typeof info.wallet.hasVotingKey).toBe('boolean');
    expect(typeof info.wallet.ownsCollateral).toBe('boolean');
    expect(typeof info.wallet.ownsPayeeScript).toBe('boolean');
    expect(typeof info.wallet.ownsOperatorRewardScript).toBe('boolean');
  });
});

describe('protxDiff', () => {
  it('returns a diff between two recent block heights', async () => {
    const tip = await client.getBlockCount();
    const baseBlock = tip - 1000;

    const diff = await client.protxDiff(baseBlock, tip);

    expect(typeof diff.baseBlockHash).toBe('string');
    expect(typeof diff.blockHash).toBe('string');
    expect(typeof diff.cbTxMerkleTree).toBe('string');
    expect(typeof diff.cbTx).toBe('string');
    expect(Array.isArray(diff.deletedMNs)).toBe(true);
    expect(Array.isArray(diff.mnList)).toBe(true);
    expect(Array.isArray(diff.deletedQuorums)).toBe(true);
    expect(Array.isArray(diff.newQuorums)).toBe(true);
    expect(typeof diff.merkleRootMNList).toBe('string');
    expect(typeof diff.merkleRootQuorums).toBe('string');

    for (const entry of diff.mnList) {
      expect(typeof entry.proRegTxHash).toBe('string');
      expect(typeof entry.confirmedHash).toBe('string');
      expect(typeof entry.service).toBe('string');
      expect(typeof entry.pubKeyOperator).toBe('string');
      expect(typeof entry.votingAddress).toBe('string');
      expect(typeof entry.isValid).toBe('boolean');
    }

    for (const quorum of diff.deletedQuorums) {
      expect(typeof quorum.llmqType).toBe('number');
      expect(typeof quorum.quorumHash).toBe('string');
    }

    for (const quorum of diff.newQuorums) {
      expect(typeof quorum.version).toBe('number');
      expect(typeof quorum.llmqType).toBe('number');
      expect(typeof quorum.quorumHash).toBe('string');
      expect(typeof quorum.signersCount).toBe('number');
      expect(typeof quorum.validMembersCount).toBe('number');
      expect(typeof quorum.quorumPublicKey).toBe('string');
    }
  });
});
