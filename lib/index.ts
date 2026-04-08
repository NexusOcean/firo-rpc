import http from 'node:http';
import https from 'node:https';
import { isHttps, isRPC, RpcClient, RpcOptions } from './types';

function Client(opts: RpcOptions): RpcClient {
  const {
    host,
    port,
    user,
    pass,
    ssl,
    batchedCalls,
    disableAgent,
    rejectUnauthorized,
  } = opts;

  const protocol = isHttps(ssl);

  if (!isRPC({ ssl, host, port })) {
    throw new Error('Not a valid rpc client');
  }

  return {
    host,
    port,
    user,
    pass,
    protocol,
    batchedCalls,
    disableAgent,
    rejectUnauthorized,
  };
}

function rpc(req: unknown, client: RpcClient, callback) {
  const request = JSON.stringify(req);
  const auth = Buffer.from(client.user + ':' + client.pass).toString('base64');
  const { host, port, protocol, rejectUnauthorized, disableAgent } = client;

  let options: http.RequestOptions | https.RequestOptions = {
    host,
    path: '/',
    method: 'POST',
    port,
    agent: disableAgent ? false : undefined,
  };

  if (protocol === 'https') {
    const unauthorized = Boolean(rejectUnauthorized);

    Object.assign(options, { rejectUnauthorized: unauthorized });
  }

  let called = false;

  let errorMessage = 'Firo JSON-RPC: ';

  const server = protocol === 'https' ? https : http;

  const rpcReq = server.request(options, function (res) {
    let buf = '';

    res.on('data', function (data) {
      buf += data;
    });

    res.on('end', function () {
      if (called) {
        return;
      }
      called = true;

      if (res.statusCode === 401) {
        callback(
          new Error(errorMessage + 'Connection Rejected: 401 Unauthorized'),
        );
        return;
      }
      if (res.statusCode === 403) {
        callback(
          new Error(errorMessage + 'Connection Rejected: 403 Forbidden'),
        );
        return;
      }
      if (
        res.statusCode === 500 &&
        buf.toString() === 'Work queue depth exceeded'
      ) {
        let exceededError = new Error(
          errorMessage + buf.toString(),
        ) as Error & { code?: number };
        exceededError.code = 429; // Too many requests
        callback(exceededError);
        return;
      }

      let parsedBuf;

      try {
        parsedBuf = JSON.parse(buf);
      } catch (e) {
        let parseError = e as Error;
        let err = new Error(
          errorMessage + 'Error Parsing JSON: ' + parseError.message,
        );
        callback(err);
        return;
      }

      callback(parsedBuf.error, parsedBuf);
    });
  });

  rpcReq.on('error', function (e) {
    var err = new Error(errorMessage + 'Request Error: ' + e.message);
    if (!called) {
      called = true;
      callback(err);
    }
  });

  rpcReq.setHeader('Content-Length', Buffer.byteLength(request));
  rpcReq.setHeader('Content-Type', 'application/json');
  rpcReq.setHeader('Authorization', 'Basic ' + auth);
  rpcReq.write(request);
  rpcReq.end();
}
