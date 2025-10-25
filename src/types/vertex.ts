export type ClientType = 'vip' | 'standard';

export interface Vertex {
  address: string;
  clientType: ClientType;
  lt: number;
  lg: number;
}

export const createVertex = (
  address: string,
  clientType: ClientType,
  lt: number,
  lg: number
): Vertex => {
  return {
    address,
    clientType,
    lt,
    lg
  };
};