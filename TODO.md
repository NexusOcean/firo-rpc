# TODO — Needs Firo Core Team's Help (updated: 2026/07/01)

## Spark

`getsparkmintmetadata`

Returns empty array for all tested input formats (lTagHash, base64 coin string from anonymity set).
Implemented with `{ coinHashes: string[] }` format per core team confirmation.
Correct coinHashes input format unconfirmed against live data.

## Spark name

`registersparkname` (transfer form) returns `-4 Spark address doesn't belong to the wallet`
even when `getallsparkaddresses` confirms the address is present in the wallet.
Tested on mainnet firod node.

Full flow for reference:

1. Current owner: `requestsparknametransfer "name" "newAddress" years "oldAddress"` → `requestHash`
2. New owner: `transfersparkname "newAddress" "requestHash"` → `transferProof`
3. Current owner: `registersparkname "name" "newAddress" years "oldAddress" "transferProof"` → **fails with -4**

`getsparknametxdetails`

Returns `-25 Unknown transaction` on mainnet for all tested inputs.

## Quorum

Typed from the `quorum getrecsig`/`hasrecsig`/`isconflicting` usage strings only. These require a
valid `id`/`msgHash` pair from an internal signing request.

`quorum dkgstatus` — `session` field unconfirmed

Only ever observed as an empty object (`{}`) because the sampled node was not mid-DKG-round at the
time. Typed loosely as `Record<string, unknown>`.

## Masternode

### Subcommands

- `protx`: register, register_fund, register_prepare, register_submit, list, info,
  update_service, update_registrar, revoke, diff
- `quorum`: list, info, dkgsimerror, dkgstatus, memberof, sign, hasrecsig, getrecsig, isconflicting
- `bls`: generate, fromsecret
- `evoznode`: count, current, outputs, status, list, winner, winners
- `evoznsync`: status, next, reset
- `spork`: list, and write form `spork "sporkprivatekey" "feeaddress" {...}`

### Needs masternode

- `protx register`, `register_fund`, `register_prepare`, `register_submit` — need collateral + owner/operator/voting keys
- `protx update_service`, `update_registrar`, `revoke` — need existing masternode + keys
- `quorum sign` — must be an active member of the quorum
- `evoznode status` — only meaningful when the node itself runs as a masternode
- `evoznode outputs` — likely requires znode collateral present in the wallet; unconfirmed
- `spork writes` — need the spork private key (Firo team only, not achievable by any external integrator)

### Questions

- `quorum dkgsimerror` — is this callable from a regular node at all.

## Legacy/Deprecated

### Deprecated (explicitly disabled/flagged in CLI help text):

- getanonymityset
- getlatestcoinid (old alias)
- getmintmetadata (old alias)
- getusedcoinserials
- evoznode count — total/enabled/qualify/all filter options only

### Legacy (account-based wallet API, outdated via Bitcoin Core):

- getaccount
- getaccountaddress
- getaddressesbyaccount
- getreceivedbyaccount
- listaccounts
- listreceivedbyaccount
- move
- sendfrom
- setaccount
- addwitnessaddress

## Mining/Regtest

### Generating

- generate
- generatetoaddress
- setgenerate

### Mining

- getblocktemplate
- getmininginfo
- getnetworkhashps
- pprpcsb
- prioritisetransaction
- submitblock

### Control

- getinfo
- getmemoryinfo
- help
- stop
