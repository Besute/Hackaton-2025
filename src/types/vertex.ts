export type ClientType = 'vip' | 'standard';

export interface Vertex {
  address: string;
  clientType: ClientType;
  lt: number;
  lg: number;
  timeOfWork: string;
}

export const createVertex = (
  address: string,
  clientType: ClientType,
  lt: number,
  lg: number,
  timeOfWork: string,
): Vertex => {
  return {
    address,
    clientType,
    lt,
    lg,
    timeOfWork
  };
};