import axios, { AxiosInstance } from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { Agent as HttpsAgent } from 'node:https';
import type { RpcConfig } from '../types/index.js';

const proxyAgent = new SocksProxyAgent(`socks5h://127.0.0.1:9050`);

export function buildHttpClient(config: RpcConfig): AxiosInstance {
  const {
    host = '127.0.0.1',
    port = 8888,
    user,
    pass,
    enableTor = false,
    protocol = 'http',
    timeout = 30_000,
    rejectUnauthorized = true,
    axiosOptions = {},
  } = config;

  const httpsAgent =
    protocol === 'https' && rejectUnauthorized === false
      ? new HttpsAgent({ rejectUnauthorized: false })
      : undefined;

  const socks5Agent = {
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent,
  };

  const httpAgent = !enableTor ? httpsAgent : socks5Agent;

  return axios.create({
    baseURL: `${protocol}://${host}:${port}`,
    timeout,
    auth: { username: user, password: pass },
    headers: { 'Content-Type': 'application/json' },
    ...httpAgent,
    ...axiosOptions,
  });
}
