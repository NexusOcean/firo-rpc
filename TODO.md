# TODO — Needs Firo Core Team's Help (updated: 2026/06/19)

First here is the conf I used for regtest, you need to create a firo.conf file at the firo data directory and put something like this.

rpcuser=levon
rpcpassword=pass
rpcallowip=127.0.0.1
rpcallowip=192.168.0.1
rpcport=8332
server=1
daemon=1

Than the next step is to run firod.
If you are using electrumx server, please check the documentation.

## `getsparkmintmetadata`

Every wire format attempted (raw string, array of objects, hex, base64, reversed bytes) returned nothing or errored. Needs core team to confirm the correct input format before implementing.

    Answer: here is the format I was able to run, you can run this also by firo-cli

curl --user levon:pass --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getsparkmintmetadata", "params": [{"coinHashes": ["b476ed2b374bb081ea51d111f68f0136252521214e213d119b8dc67b92f5a390","b476ed2b374bb081ea51d111f68f0136252521214e213d119b8dc67b92f5a390", "hash2...", "hash3..."]}]}' -H 'content-type: text/plain;' http://127.0.0.1:8332/

firo-cli verison

./firo-cli -regtest getsparkmintmetadata '{"coinHashes": ["b476ed2b374bb081ea51d111f68f0136252521214e213d119b8dc67b92f5a390","b476ed2b374bb081ea51d111f68f0136252521214e213d119b8dc67b92f5a390"]}'

## `getmempoolsparktxs`

Every form returned `JSON value is not an object as expected`, including the exact form from the help example. Needs core team to confirm correct call format.

    Answer: this has a bug and is not being used, at some point we decided not to support this, but use getmempoolsparktxids which gives just tx ids, in case client will need the entire tx, it can get the tx by tx id.

## `getsparknametxdetails`

Returns `method not found` on two different nodes. May not be implemented in the current Firo release. Needs core team to confirm availability and correct node version.

    Answer We have such rpc inside node and I was able to run it directly from firod server, if you are using electrumX, this rpc is not added there, but we have getsparknames and getsparknamedata calls in electrumx

examples I used:

./firo-cli -regtest getsparknametxdetails "b476ed2b374bb081ea51d111f68f0136252521214e213d119b8dc67b92f5a390"

curl --user levon:pass --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getsparknametxdetails", "params": ["b476ed2b374bb081ea51d111f68f0136252521214e213d119b8dc67b92f5a390"]}' -H 'content-type: text/plain;' http://127.0.0.1:8332/

## `getsparkaddressbalance` — malformed field names in response

Response keys have trailing spaces and colons: `"availableBalance: "` instead of `"availableBalance"`. Inconsistent with `getsparkbalance` which returns clean field names. Currently worked around in the SDK by normalizing keys in the client before returning.

    Answer: I fully agree with this, but for now better not to modify it, as we already have clients using this rpc calls and changing will break some stuff.

## Spark name transfer — step 3 blocked

`registersparkname` (transfer form) returns `-4 Spark address doesn't belong to the wallet` even when `getallsparkaddresses` confirms the address is present in the wallet. Tested on Docker/firod node.

Full flow for reference:

1. Current owner: `requestsparknametransfer "name" "newAddress" years "oldAddress"` → `requestHash`
2. New owner: `transfersparkname "newAddress" "requestHash"` → `transferProof`
3. Current owner: `registersparkname "name" "newAddress" years "oldAddress" "transferProof"` → **fails with -4**

   Please give your setup (if it is on testnet or regtest) to be able to check it on our side and give you more accurate answer.
