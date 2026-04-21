import axios, { AxiosInstance, AxiosError } from 'axios';
import { Agent as HttpsAgent } from 'node:https';

export interface RpcConfig {
  host?: string;
  port?: number;
  user: string;
  pass: string;
  protocol?: 'http' | 'https';
  timeout?: number;
  rejectUnauthorized?: boolean;
}

export interface RpcRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params: unknown[];
}

export interface RpcResponse<T = unknown> {
  result: T | null;
  error: RpcError | null;
  id: number | string;
}

export interface RpcError {
  code: number;
  message: string;
}

export class RpcCallError extends Error {
  public readonly code: number;
  public readonly httpStatus?: number;

  constructor(message: string, code: number, httpStatus?: number) {
    super(message);
    this.name = 'RpcCallError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

export function buildHttpClient(config: RpcConfig): AxiosInstance {
  const {
    host = '127.0.0.1',
    port = 8888,
    user,
    pass,
    protocol = 'http',
    timeout = 30_000,
    rejectUnauthorized = true,
  } = config;

  const httpsAgent =
    protocol === 'https' && rejectUnauthorized === false
      ? new HttpsAgent({ rejectUnauthorized: false })
      : undefined;

  return axios.create({
    baseURL: `${protocol}://${host}:${port}`,
    timeout,
    auth: { username: user, password: pass },
    headers: { 'Content-Type': 'application/json' },
    httpsAgent,
  });
}

export async function callRpc<T = unknown>(
  http: AxiosInstance,
  method: string,
  params: unknown[] = [],
): Promise<T> {
  const request: RpcRequest = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params,
  };

  try {
    const { data } = await http.post<RpcResponse<T>>('/', request);

    if (data.error) {
      throw new RpcCallError(data.error.message, data.error.code);
    }

    return data.result as T;
  } catch (err) {
    if (err instanceof RpcCallError) throw err;

    const axiosErr = err as AxiosError;
    const status = axiosErr.response?.status;

    if (status === 401) {
      throw new RpcCallError('Unauthorized: check user/pass', -401, 401);
    }
    if (status === 403) {
      throw new RpcCallError('Forbidden', -403, 403);
    }
    if (status === 500 && typeof axiosErr.response?.data === 'string') {
      throw new RpcCallError(axiosErr.response.data, -500, 500);
    }

    throw new RpcCallError(`RPC request failed: ${axiosErr.message}`, -1, status);
  }
}

export interface FiroRpcClient {
  call<T = unknown>(method: string, ...params: unknown[]): Promise<T>;
  batch(calls: BatchCall[]): Promise<BatchResult[]>;
}

export function createFiroRpcClient(config: RpcConfig): FiroRpcClient {
  const http = buildHttpClient(config);

  return {
    call<T = unknown>(method: string, ...params: unknown[]): Promise<T> {
      return callRpc<T>(http, method, params);
    },
    batch(calls: BatchCall[]): Promise<BatchResult[]> {
      return callRpcBatch(http, calls);
    },
  };
}

export interface BatchCall {
  method: string;
  params?: unknown[];
}

export interface BatchResult<T = unknown> {
  result: T | null;
  error: RpcError | null;
}

async function callRpcBatch(http: AxiosInstance, calls: BatchCall[]): Promise<BatchResult[]> {
  if (calls.length === 0) return [];

  const requests: RpcRequest[] = calls.map((call, i) => ({
    jsonrpc: '2.0',
    id: `${Date.now()}-${i}`,
    method: call.method,
    params: call.params ?? [],
  }));

  try {
    const { data } = await http.post<RpcResponse[]>('/', requests);

    if (!Array.isArray(data)) {
      throw new RpcCallError('Expected array response for batch request', -1);
    }

    // Responses may come back out of order — re-sort by id
    const byId = new Map(data.map((r) => [r.id, r]));

    return requests.map((req) => {
      const res = byId.get(req.id);
      if (!res) {
        return {
          result: null,
          error: { code: -1, message: 'Missing response for request' },
        };
      }
      return { result: res.result, error: res.error };
    });
  } catch (err) {
    if (err instanceof RpcCallError) throw err;
    const axiosErr = err as AxiosError;
    throw new RpcCallError(
      `RPC batch request failed: ${axiosErr.message}`,
      -1,
      axiosErr.response?.status,
    );
  }
}
