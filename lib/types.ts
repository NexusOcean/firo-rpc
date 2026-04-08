type RPC = {
  ssl: boolean;
  host: string;
  port: number;
};

type protocol = 'https' | 'http';

export const isHttps = (ssl: boolean): protocol => (ssl ? 'https' : 'http');

export const isRPC = ({ ssl, host, port }: RPC): boolean => {
  try {
    const hostname = new URL(host).hostname;
    const protocol = isHttps(ssl);

    const url = new URL(`${protocol}//${hostname}:${port}`);

    return URL.canParse(url);
  } catch {
    throw new Error('Invalid rpc url');
  }
};

export interface RPCOptions {
  host: string;
  port: number;
  user: string;
  pass: string;
  ssl: boolean;
  batchedCalls: Record<string, string | string[]> | null;
  disableAgent?: boolean;
  rejectUnauthorized: string | boolean;
}

export interface RPCClient {
  host: string;
  port: number;
  user: string;
  pass: string;
  protocol: 'http' | 'https';
  batchedCalls: Record<string, string | string[]> | null;
  disableAgent?: boolean;
  rejectUnauthorized: string | boolean;
}
