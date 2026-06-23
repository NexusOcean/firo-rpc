# TODO — Needs Firo Core Team's Help (updated: 2026/06/23)

## `getsparkmintmetadata`

Returns empty array for all tested input formats (lTagHash, base64 coin string from anonymity set).
Implemented with `{ coinHashes: string[] }` format per core team confirmation.
Correct coinHashes input format unconfirmed against live data.

## Spark name transfer — step 3 blocked

`registersparkname` (transfer form) returns `-4 Spark address doesn't belong to the wallet`
even when `getallsparkaddresses` confirms the address is present in the wallet.
Tested on mainnet firod node.

Full flow for reference:

1. Current owner: `requestsparknametransfer "name" "newAddress" years "oldAddress"` → `requestHash`
2. New owner: `transfersparkname "newAddress" "requestHash"` → `transferProof`
3. Current owner: `registersparkname "name" "newAddress" years "oldAddress" "transferProof"` → **fails with -4**

## `getsparknametxdetails`

Returns `-25 Unknown transaction` on mainnet for all tested inputs.

## Evo / Masternode methods

Named as a deliverable, roughly 30+ sub-commands across protx, evoznode, evoznsync, quorum, bls, spork, removeislock.

Needs clarification:

- Which sub-commands are needed, or would you like them all?
- Should each sub-command be its own typed method (e.g. `protxList()`, `protxInfo()`)
  or a generic dispatcher (e.g. `protx(subcommand, ...args)`)?
