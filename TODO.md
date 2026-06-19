# Deferred — Needs Firo Core Team

## `getsparkmintmetadata`

Confirmed via raw JSON-RPC (bypassing firo-cli) that the daemon expects `{"mints": [...]}` as the param object — the error message names the field explicitly: "mints is expected to be an array". However, the identical error persists regardless of what's passed for `mints`: bare string, single-element array of strings, single-element array of objects with a "coin" field. Error message appears static/not reflective of actual validation logic. Needs core team to confirm correct element shape for the mints array, or whether this is a daemon-side bug.

## `getsparknametxdetails`

Returns `method not found` on two different nodes. May not be implemented in the current Firo release. Needs core team to confirm availability and correct node version.

## `getsparkaddressbalance` — malformed field names in response

Response keys have trailing spaces and colons: `"availableBalance: "` instead of `"availableBalance"`. Inconsistent with `getsparkbalance` which returns clean field names. Currently worked around in the SDK by normalizing keys in the client before returning.

## `setsparkmintstatus` — resolved, firo-cli bug only

`firo-cli setsparkmintstatus "<lTagHash>" true/false` fails with "JSON value is not a boolean as expected" regardless of quoting — confirmed this is a firo-cli argument-parsing bug, not a daemon issue. Raw JSON-RPC with a real boolean works fine (`"result":null,"error":null`). SDK calls the RPC directly with proper JSON types, so this does not affect the client.

## Spark name transfer — step 3 blocked

`registersparkname` (transfer form) returns `-4 Spark address doesn't belong to the wallet` even when `getallsparkaddresses` confirms the address is present in the wallet. Tested on Docker/firod node.

Full flow for reference:

1. Current owner: `requestsparknametransfer "name" "newAddress" years "oldAddress"` → `requestHash`
2. New owner: `transfersparkname "newAddress" "requestHash"` → `transferProof`
3. Current owner: `registersparkname "name" "newAddress" years "oldAddress" "transferProof"` → **fails with -4**
