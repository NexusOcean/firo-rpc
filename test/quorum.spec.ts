import { makeClient } from './setup.js';

const client = makeClient();

describe('quorumList', () => {
  it('returns quorum hashes keyed by LLMQ type', async () => {
    const list = await client.quorumList();
    expect(typeof list).toBe('object');
    const types = Object.keys(list);
    expect(types.length).toBeGreaterThan(0);
    for (const type of types) {
      expect(Array.isArray(list[type])).toBe(true);
      for (const hash of list[type]!) {
        expect(typeof hash).toBe('string');
      }
    }
  });
});

describe('quorumInfo', () => {
  it('returns member details for a known quorum', async () => {
    const list = await client.quorumList();

    const quorumHash = list['llmq_50_60']![0]!;
    const info = await client.quorumInfo(1, quorumHash);

    expect(typeof info.height).toBe('number');
    expect(typeof info.type).toBe('string');
    expect(info.quorumHash).toBe(quorumHash);
    expect(typeof info.minedBlock).toBe('string');
    expect(typeof info.quorumPublicKey).toBe('string');
    expect(Array.isArray(info.members)).toBe(true);
    expect(info.members.length).toBeGreaterThan(0);
    for (const member of info.members) {
      expect(typeof member.proTxHash).toBe('string');
      expect(typeof member.valid).toBe('boolean');
    }
  });
});

describe('quorumDkgStatus', () => {
  it('returns DKG status with minable commitments', async () => {
    const status = await client.quorumDkgStatus();
    expect(typeof status.time).toBe('number');
    expect(typeof status.timeStr).toBe('string');
    expect(typeof status.session).toBe('object');
    expect(typeof status.minableCommitments).toBe('object');

    for (const key of Object.keys(status.minableCommitments)) {
      const commitment = status.minableCommitments[key]!;
      expect(typeof commitment.version).toBe('number');
      expect(typeof commitment.llmqType).toBe('number');
      expect(typeof commitment.quorumHash).toBe('string');
      expect(typeof commitment.signersCount).toBe('number');
      expect(typeof commitment.validMembersCount).toBe('number');
      expect(typeof commitment.quorumPublicKey).toBe('string');
    }
  });
});

describe('quorumMemberOf', () => {
  it('returns the quorums a known ProTx is a member of', async () => {
    const list = await client.quorumList();
    const info = await client.quorumInfo(1, list['llmq_50_60']![0]!);
    const proTxHash = info.members[0]!.proTxHash;

    const memberships = await client.quorumMemberOf(proTxHash);
    expect(Array.isArray(memberships)).toBe(true);
    for (const membership of memberships) {
      expect(typeof membership.height).toBe('number');
      expect(typeof membership.type).toBe('string');
      expect(typeof membership.quorumHash).toBe('string');
      expect(typeof membership.minedBlock).toBe('string');
      expect(typeof membership.quorumPublicKey).toBe('string');
      expect(typeof membership.isValidMember).toBe('boolean');
      expect(typeof membership.memberIndex).toBe('number');
    }
  });
});

describe('quorumGetRecSig / quorumHasRecSig / quorumIsConflicting', () => {
  it('are functions', () => {
    expect(typeof client.quorumGetRecSig).toBe('function');
    expect(typeof client.quorumHasRecSig).toBe('function');
    expect(typeof client.quorumIsConflicting).toBe('function');
  });
});
