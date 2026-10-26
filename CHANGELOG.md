# Changelog

## 0.7.0 — 2026-10-26

### Added

- `callWithOptions(method, params, options)` on `FiroRpcClient` — like `call`, but takes a `CallOptions` object with a per-request `timeout` (overrides the client timeout) and an `AbortSignal` for cancellation. `call` is unchanged
- `CallOptions` type exported from main entry point
- Wallet encryption methods on `FiroRpcClient`: `encryptWallet`, `walletPassphrase`, `walletPassphraseChange`, `walletLock`. `encryptWallet` shuts the daemon down on success; on an unencrypted wallet the other three reject with code `-15`
- Optional `FIRO_WALLET_PASSPHRASE` in `.env.test` — the wallet and Spark test suites unlock an encrypted wallet with it before running

### Fixed

- `RpcCallError` now carries the daemon's error code and message when an RPC error arrives as an HTTP 500/404 with a JSON body (e.g. `-13` for a locked wallet, `-32601` for an unknown method) — previously reported as a generic `Request failed with status code 500` with code `-1`
- `getSparkNameTxDetails` test used a real Spark name registration as its "unknown txid" fixture

## 0.6.0 — 2026-07-23

### Removed

- `enableTor` option removed from `RpcConfig` along with the built-in SOCKS5 proxy support in `buildHttpClient` — connect through a Tor daemon by passing a custom agent via `axiosOptions` instead
- `socks-proxy-agent` dependency dropped
- `examples/tor.ts` removed

## 0.5.1 — 2026-07-10

### Fixed

- `getSparkBalance` and `getSparkAddressBalance` no longer manually remap response keys — the daemon now returns clean camelCase keys (`availableBalance`, `unconfirmedBalance`, `fullBalance`) so the workaround that mapped trailing-space variants (e.g. `"availableBalance: "`) has been removed

## 0.5.0 — 2026-06-19

### Added

- Spark wallet methods on `FiroRpcClient`: `getUsedCoinsTags`, `getNewSparkAddress`, `getAllSparkAddresses`, `getSparkDefaultAddress`, `getTotalBalance`, `getPrivateBalance`, `dumpSparkViewKey`, `listSparkMints`, `listSparkSpends`, `listUnspentSparkMints`, `identifySparkCoins`, `getSparkCoinAddr`, `setSparkMintStatus`, `mintSpark`, `resetSparkMints`, `autoMintSpark`, `getMempoolSparkTxs`
- Spark types exported from main entry point: `SparkAddresses`, `SparkMint`, `SparkSpend`, `UnspentSparkMint`, `IdentifySparkCoinsResult`, `SparkCoinAddress`, `SparkMintRecipient`, `SparkMintRecipients`, `MempoolSparkTxs`, `UsedCoinsTags`
- Full Spark wallet test coverage in `test/spark.spec.ts`

### Fixed

- `getUsedCoinsTags` now stringifies its index parameter before sending — the daemon rejects a raw JSON number for this RPC and expects a string, consistent with `getSparkAnonymitySet`/`getSparkAnonymitySetMeta`/`getSparkAnonymitySetSector`

## 0.4.0 — 2026-05-20

### Added

- Blockchain methods on `FiroRpcClient`: `getBestBlockHash`, `getBlockHeader` (with verbose overloads), `getTxOut`
- Wallet methods on `FiroRpcClient`: `listUnspent`, `importAddress`
- New types exported from main entry point: `BlockHeader`, `TxOut`, `UnspentOutput`

## 0.3.0 — 2026-05-05

### Added

- Wallet methods on `FiroRpcClient`: `getWalletInfo`, `getNewAddress`, `validateAddress`, `getBalance`, `getUnconfirmedBalance`, `getTransaction`, `listTransactions`, `listSinceBlock`, `sendToAddress`, `getReceivedByAddress`
- Wallet types exported from main entry point: `WalletInfo`, `ValidateAddressResult`, `WalletTxCategory`, `WalletTransactionDetail`, `WalletTransactionListEntry`, `WalletTransaction`, `ListSinceBlockResult`
- Verbose overloads on `getRawTransaction` and `getRawMempool` — pass `false` to receive raw hex / txid array, default behavior unchanged

### Changed

- `getRawTransaction` and `getRawMempool` implementations cast to overload-typed signatures; runtime behavior unchanged

## 0.2.1 — 2026-04-26

### Added

- `getAddressBalance(address)` → `FiroAddressBalance` (requires `-addressindex`)
- `getAddressTxIds(address)` → `FiroAddressTxIds` (requires `-addressindex`)
- `FiroAddressBalance` and `FiroAddressTxIds` types exported from main entry point
- `examples/` folder with runnable scenarios: `search.ts`, `wallet.ts`, `mempool.ts`, `network.ts`

## 0.2.0 — 2026-04-26

### Added

- Typed methods on `FiroRpcClient`: `getBlockCount`, `getBlockHash`, `getBlock`, `getBlockchainInfo`, `getTxOutSetInfo`, `getRawTransaction`, `getMempoolInfo`, `getRawMempool`, `getMempoolEntry`, `getNetworkInfo`, `getPeerInfo`
- Firo-specific response types: `Block`, `Transaction`, `Vin` union (`CoinbaseVin`, `StandardVin`, `SparkSpendVin`), `Vout`, `CbTx`, `ProUpServTx`, `FinalCommitment`, `BlockchainInfo`, `TxOutSetInfo`, `NetworkInfo`, `PeerInfo`, `MempoolInfo`, `MempoolEntry`, `RawMempool`
- `TxType` enum covering types `0`, `2`, `5`, `6`, `8`, `9`, `14`

### Changed

- Source moved from `lib/` to `src/` and split into `utils/`, `types/`, and `client.ts`
- `generic call<T>` and `batch` remain unchanged — fully backwards compatible

## 0.1.1 — 2026-04-21

- Added missing `axiosOptions` to `RpcConfig` for passing axios request config

## 0.1.0 — 2026-04-21

Initial release of the TypeScript rewrite. Breaking changes from the original `bitcoind-rpc-zcoin`:

- **Promise-based API**
- **Axios transport**
- **Updated batch requests**
- **Generic RPC call functions**
- **Implementation using Node 24**
