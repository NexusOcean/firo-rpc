# Deferred — Needs Firo Core Team

## `getsparkmintmetadata`

Every wire format attempted (raw string, array of objects, hex, base64, reversed bytes) returned nothing or errored. Needs core team to confirm the correct input format before implementing.

## `getmempoolsparktxs`

Every form returned `JSON value is not an object as expected`, including the exact form from the help example. Needs core team to confirm correct call format.

## `getsparknametxdetails`

Returns `method not found` on two different nodes. May not be implemented in the current Firo release. Needs core team to confirm availability and correct node version.

## `getsparkaddressbalance` — malformed field names in response

Response keys have trailing spaces and colons: `"availableBalance: "` instead of `"availableBalance"`. Inconsistent with `getsparkbalance` which returns clean field names. Currently worked around in the SDK by normalizing keys in the client before returning.

## Spark name transfer — step 3 blocked

`registersparkname` (transfer form) returns `-4 Spark address doesn't belong to the wallet` even when `getallsparkaddresses` confirms the address is present in the wallet. Tested on Docker/firod node.

Full flow for reference:

1. Current owner: `requestsparknametransfer "name" "newAddress" years "oldAddress"` → `requestHash`
2. New owner: `transfersparkname "newAddress" "requestHash"` → `transferProof`
3. Current owner: `registersparkname "name" "newAddress" years "oldAddress" "transferProof"` → **fails with -4**
