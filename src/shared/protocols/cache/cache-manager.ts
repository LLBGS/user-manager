export interface InvalidateOptions {
  type: 'invalidate' | 'invalidatePrefix';
}

export enum ExpireTimeMode {
  MINUTES = 'minutes',
  SECONDS = 'seconds',
}

export interface TemporarySaveOptions {
  key: string;
  value: any;
  expire: {
    mode: ExpireTimeMode;
    time: number;
  };
}

export interface CacheManager {
  recover<T = any>(key: string): Promise<T | null>;
  save(key: string, value: any): Promise<void>;
  temporarySave(options: TemporarySaveOptions): Promise<void>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}

export interface CacheManagerConfig {
  host: string;
  port: number;
  family: number;
  password: string;
  username: string;
  db: number;
}
