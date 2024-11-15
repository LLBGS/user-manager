import {
  CacheManager,
  CacheManagerConfig,
  ExpireTimeMode,
  TemporarySaveOptions,
} from '@/shared/protocols/cache/cache-manager';
import Redis, { Redis as RedisClient } from 'ioredis';

export class RedisCacheManager implements CacheManager {
  private readonly client: RedisClient;
  static instance: RedisCacheManager;

  private constructor(config: CacheManagerConfig) {
    this.client = new Redis(config);
  }

  static getInstance(config: CacheManagerConfig): RedisCacheManager {
    if (!this.instance) this.instance = new RedisCacheManager(config);
    return this.instance;
  }

  async save(key: string, value: any): Promise<void> {
    const totalDayHours = 24;
    const dayToMinutes = totalDayHours * 60;
    await this.temporarySave({
      key,
      value,
      expire: { mode: ExpireTimeMode.MINUTES, time: dayToMinutes },
    });
  }

  async temporarySave(options: TemporarySaveOptions): Promise<void> {
    const { key, value, expire } = options;
    const expirationTime = this.convertExpireTimeByMode(expire.time, expire.mode);
    const redisExpirationModeInSeconds = 'EX';
    await this.client.set(
      key,
      JSON.stringify(value),
      redisExpirationModeInSeconds,
      expirationTime,
    );
  }

  async recover<T = any>(key: string): Promise<T | null> {
    const cachedValue = await this.client.get(key);
    if (!cachedValue) return null;
    const value = JSON.parse(cachedValue) as T;
    return value;
  }

  async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);
    const pipeline = this.client.pipeline();
    keys.forEach((key) => pipeline.del(key));
    await pipeline.exec();
  }

  private convertExpireTimeByMode(time: number, mode: ExpireTimeMode): number {
    const isMinuteMode = mode === ExpireTimeMode.MINUTES;
    if (isMinuteMode) return time * 60;
    return time;
  }
}
