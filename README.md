# firo-rpc

Modern TypeScript client for Firo's JSON-RPC interface. Promise-based, functional, with batch support.

An opinionated rewrite of [firoorg/bitcoind-rpc-zcoin](https://github.com/firoorg/bitcoind-rpc-zcoin) using functional programming, async/await, and TypeScript. A [PR](https://github.com/firoorg/bitcoind-rpc-zcoin/pull/4) is open on the original repo — prefer that if merged.

This is an early release and may change frequently. See [CHANGELOG.md](./CHANGELOG.md) for version history and breaking changes.

## Install

```bash
npm install @nexusocean/firo-rpc
```

## Usage

```typescript
import { createFiroRpcClient } from '@nexusocean/firo-rpc';

const client = createFiroRpcClient({
  host: '127.0.0.1',
  port: 8888,
  user: 'rpcuser',
  pass: 'rpcpass',
  protocol: 'http',
});

const count = await client.call<number>('getblockcount');

const results = await client.batch([
  { method: 'getblockhash', params: [count] },
  { method: 'getblockhash', params: [count - 1] },
]);
```

## License

MIT — original copyright 2013-2014 BitPay, Inc.
