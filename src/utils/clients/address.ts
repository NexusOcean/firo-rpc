import type { AxiosInstance } from 'axios';
import { callRpc } from '../rpc.js';
import type {
  FiroAddressBalance,
  FiroAddressTxIds,
} from '../../types/index.js';

export interface AddressIndexMethods {
  getAddressBalance(address: string): Promise<FiroAddressBalance>;
  getAddressTxIds(address: string): Promise<FiroAddressTxIds>;
}

export function createAddressIndexMethods(
  http: AxiosInstance,
): AddressIndexMethods {
  return {
    getAddressBalance(address: string): Promise<FiroAddressBalance> {
      return callRpc<FiroAddressBalance>(http, 'getaddressbalance', [
        { addresses: [address] },
      ]);
    },

    getAddressTxIds(address: string): Promise<FiroAddressTxIds> {
      return callRpc<FiroAddressTxIds>(http, 'getaddresstxids', [
        { addresses: [address] },
      ]);
    },
  };
}
