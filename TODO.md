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
Confirmed working on regtest via direct firod. Not available on ElectrumX.
Valid Spark name registration tx hash format unconfirmed against live data.
