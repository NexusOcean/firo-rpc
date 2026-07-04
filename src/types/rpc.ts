export interface RpcConfig {
  host?: string;
  port?: number;
  user: string;
  pass: string;
  enableTor?: boolean;
  protocol?: 'http' | 'https';
  timeout?: number;
  rejectUnauthorized?: boolean;
  axiosOptions?: import('axios').AxiosRequestConfig;
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

export interface BatchCall {
  method: string;
  params?: unknown[];
}

export interface BatchResult<T = unknown> {
  result: T | null;
  error: RpcError | null;
}
