# Changelog

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
