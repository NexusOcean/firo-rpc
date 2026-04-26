# firo-rpc

Modern TypeScript client for Firo's JSON-RPC interface. Promise-based, strongly typed, with batch support.

An opinionated rewrite of [firoorg/bitcoind-rpc-zcoin](https://github.com/firoorg/bitcoind-rpc-zcoin) using functional programming, async/await, and TypeScript. A [PR](https://github.com/firoorg/bitcoind-rpc-zcoin/pull/4) is open on the original repo — prefer that if merged.

> Early release — may change frequently. See [CHANGELOG.md](./CHANGELOG.md) for version history and breaking changes.

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

| Method                       | Returns              |
| ---------------------------- | -------------------- |
| `getBlockCount()`            | `number`             |
| `getBlockHash(height)`       | `string`             |
| `getBlock(hash)`             | `Block`              |
| `getBlockchainInfo()`        | `BlockchainInfo`     |
| `getTxOutSetInfo()`          | `TxOutSetInfo`       |
| `getRawTransaction(txid)`    | `Transaction`        |
| `getMempoolInfo()`           | `MempoolInfo`        |
| `getRawMempool()`            | `RawMempool`         |
| `getMempoolEntry(txid)`      | `MempoolEntry`       |
| `getNetworkInfo()`           | `NetworkInfo`        |
| `getAddressBalance(address)` | `FiroAddressBalance` |
| `getAddressTxIds(address)`   | `FiroAddressTxIds`   |

> `getAddressBalance` and `getAddressTxIds` require `-addressindex` enabled on your Firo node.

Any unlisted RPC method is accessible via `client.call<T>(method, params)`.

## What You Can Build

These are real use cases — the author's own [Firo block explorer](https://github.com/nexusocean) was built with this library.

**Block Explorer & Search**
Query blocks, transactions, and addresses with automatic query routing. The author's own Firo block explorer was built with this library. See [`examples/search.ts`](./examples/search.ts).

**Wallet Tooling**
Look up address balance and transaction history. See [`examples/wallet.ts`](./examples/wallet.ts).

**Mempool Monitor**
Poll `getMempoolInfo` and `getRawMempool` to watch unconfirmed transactions in real time. See [`examples/mempool.ts`](./examples/mempool.ts).

**Network Dashboard**
Use `getNetworkInfo` and `getPeerInfo` to visualize node connectivity and peer health. See [`examples/network.ts`](./examples/network.ts).

## Examples

See the [`examples/`](./examples/) folder for runnable scenarios. All examples require a `.env.test` file with your node credentials and use `tsx`:

```bash
npx tsx examples/search.ts <txid|height|address>
npx tsx examples/wallet.ts <address>
npx tsx examples/block-explorer.ts
npx tsx examples/mempool-monitor.ts
npx tsx examples/network-dashboard.ts
```

## License

MIT — original copyright 2013–2014 BitPay, Inc. Rewritten and maintained by [nexusocean8](https://github.com/nexusocean8). Based on work by the [firoorg](https://github.com/firoorg) maintainers.
