export interface DatabaseProtocol {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
