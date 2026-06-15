# firo-rpc

TypeScript client for Firo's JSON-RPC interface. Promise-based, strongly typed, with batch support. Built on Axios, targeting Node 24.

## Install

```bash
npm install @nexusocean/firo-rpc
```

## Quick Start

```typescript
import { createFiroRpcClient } from '@nexusocean/firo-rpc';

const client = createFiroRpcClient({
  host: '127.0.0.1',
  port: 8888,
  user: 'rpcuser',
  pass: 'rpcpass',
  protocol: 'http',
});

// Typed method
const info = await client.getBlockchainInfo();
console.log(info.chain, info.blocks);

// Generic call
const count = await client.call<number>('getblockcount');

// Batch request
const hashes = await client.batch([
  { method: 'getblockhash', params: [count] },
  { method: 'getblockhash', params: [count - 1] },
]);
```

## Typed Methods

All methods return typed responses. See `src/types/` for full type definitions.

**Blockchain**

| Method                    | Returns          |
| ------------------------- | ---------------- |
| `getBlockCount()`         | `number`         |
| `getBlockHash(height)`    | `string`         |
| `getBestBlockHash()`      | `string`         |
| `getBlock(hash)`          | `Block`          |
| `getBlockHeader(hash)`    | `BlockHeader`    |
| `getBlockchainInfo()`     | `BlockchainInfo` |
| `getTxOutSetInfo()`       | `TxOutSetInfo`   |
| `getTxOut(txid, n)`       | `TxOut`          |
| `getRawTransaction(txid)` | `Transaction`    |
| `getMempoolInfo()`        | `MempoolInfo`    |
| `getRawMempool()`         | `RawMempool`     |
| `getMempoolEntry(txid)`   | `MempoolEntry`   |

**Network**

| Method             | Returns       |
| ------------------ | ------------- |
| `getNetworkInfo()` | `NetworkInfo` |
| `getPeerInfo()`    | `PeerInfo[]`  |

**Wallet**

| Method                           | Returns                        |
| -------------------------------- | ------------------------------ |
| `getWalletInfo()`                | `WalletInfo`                   |
| `getBalance()`                   | `number`                       |
| `getUnconfirmedBalance()`        | `number`                       |
| `getNewAddress()`                | `string`                       |
| `validateAddress(address)`       | `ValidateAddressResult`        |
| `getTransaction(txid)`           | `WalletTransaction`            |
| `listTransactions()`             | `WalletTransactionListEntry[]` |
| `listSinceBlock(hash?)`          | `ListSinceBlockResult`         |
| `listUnspent()`                  | `UnspentOutput[]`              |
| `sendToAddress(address, amount)` | `string`                       |
| `getReceivedByAddress(address)`  | `number`                       |
| `importAddress(address)`         | `void`                         |

**Address Index**

| Method                       | Returns              |
| ---------------------------- | -------------------- |
| `getAddressBalance(address)` | `FiroAddressBalance` |
| `getAddressTxIds(address)`   | `FiroAddressTxIds`   |

> `getAddressBalance` and `getAddressTxIds` require `-addressindex` enabled on your Firo node.

Any unlisted RPC method is accessible via `client.call<T>(method, params)`.

## What You Can Build

**Block Explorer & Search**
Query blocks, transactions, and addresses with automatic query routing. See [`examples/search.ts`](./examples/search.ts).

**Wallet Tooling**
Look up address balance and transaction history. See [`examples/wallet.ts`](./examples/wallet.ts).

**Mempool Monitor**
Poll `getMempoolInfo` and `getRawMempool` to watch unconfirmed transactions in real time. See [`examples/mempool.ts`](./examples/mempool.ts).

**Network Dashboard**
Use `getNetworkInfo` and `getPeerInfo` to visualize node connectivity and peer health. See [`examples/network.ts`](./examples/network.ts).

## Node Requirements

Some methods require specific flags enabled on your Firo node. Add these to `firo.conf` (most index flags require a one-time `-reindex` if added after initial sync):

| Flag             | Required for                                                   |
| ---------------- | -------------------------------------------------------------- |
| `txindex=1`      | `getRawTransaction` for non-wallet, non-mempool transactions   |
| `addressindex=1` | `getAddressBalance`, `getAddressTxIds`                         |
| `mobile=1`       | All Spark light-wallet methods (`getSparkAnonymitySet*`, etc.) |

## Examples

See the [`examples/`](./examples/) folder for runnable scenarios. All examples require a `.env.test` file with your node credentials and use `tsx`:

```bash
npx tsx examples/search.ts <txid|height|address>
npx tsx examples/wallet.ts <address>
npx tsx examples/mempool.ts
npx tsx examples/network.ts
```

## License

MIT
