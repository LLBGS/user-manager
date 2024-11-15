import { RedisCacheManager } from '@/shared/infra/cache/redis-cache-manager';
import {
  CacheManagerConfig,
  ExpireTimeMode,
} from '@/shared/protocols/cache/cache-manager';
import Chance from 'chance';
import * as ioRedis from 'ioredis';

jest.mock('ioredis');

const mockRedisConfig = (): CacheManagerConfig => ({
  db: Chance().integer(),
  family: Chance().integer(),
  host: Chance().word(),
  password: Chance().word(),
  port: Chance().integer(),
  username: Chance().word(),
});

const createSut = (): RedisCacheManager => {
  return RedisCacheManager.getInstance(mockRedisConfig());
};

describe(`${RedisCacheManager.name} Suite Tests`, () => {
  const mockedIoRedis = ioRedis as jest.Mocked<typeof ioRedis>;
  afterEach(() => jest.clearAllMocks());
  it('should call temporarySave with correct params if expire mode in seconds', async () => {
    const sut = createSut();
    const redisSet = jest.spyOn(mockedIoRedis.default.prototype, 'set');
    const temporarySaveOptions = {
      key: Chance().word(),
      value: Chance().word(),
      expire: { mode: ExpireTimeMode.SECONDS, time: Chance().integer() },
    };
    await sut.temporarySave(temporarySaveOptions);

    expect(redisSet).toHaveBeenCalledWith(
      temporarySaveOptions.key,
      JSON.stringify(temporarySaveOptions.value),
      'EX',
      temporarySaveOptions.expire.time,
    );
  });

  it('should call temporarySave with correct params if expire mode in minutes', async () => {
    const sut = createSut();

    const redisSetSpy = jest.spyOn(mockedIoRedis.default.prototype, 'set');
    const temporarySaveOptions = {
      key: Chance().word(),
      value: Chance().word(),
      expire: { mode: ExpireTimeMode.MINUTES, time: Chance().integer() },
    };
    await sut.temporarySave(temporarySaveOptions);
    const expectedTime = temporarySaveOptions.expire.time * 60;
    expect(redisSetSpy).toHaveBeenCalledWith(
      temporarySaveOptions.key,
      JSON.stringify(temporarySaveOptions.value),
      'EX',
      expectedTime,
    );
  });

  it('Should call save with correct params with a default expiration time', async () => {
    const sut = createSut();
    const redisSetSpy = jest.spyOn(mockedIoRedis.default.prototype, 'set');
    const key = Chance().word();
    const value = { anyKey: Chance().color() };
    const teporarySaveSpy = jest.spyOn(sut, 'temporarySave');
    await sut.save(key, value);
    const dayToSeconds = 24 * 60 * 60;
    expect(redisSetSpy).toHaveBeenCalledWith(
      key,
      JSON.stringify(value),
      'EX',
      dayToSeconds,
    );
    const dayToMinutes = 24 * 60;
    expect(teporarySaveSpy).toHaveBeenCalledWith({
      key,
      value,
      expire: { mode: ExpireTimeMode.MINUTES, time: dayToMinutes },
    });
  });
  it('Should call invalidate with correct params', async () => {
    const sut = createSut();
    const key = Chance().word();
    const redisDelSpy = jest.spyOn(mockedIoRedis.default.prototype, 'del');
    await sut.invalidate(key);
    expect(redisDelSpy).toHaveBeenCalledWith(key);
  });

  it('Should return correct parsed value if redis.get returns a value', async () => {
    const sut = createSut();
    const key = Chance().name();
    const value = { anyKey: Chance().word() };
    const redisGetSpy = jest.spyOn(mockedIoRedis.default.prototype, 'get');
    redisGetSpy.mockResolvedValueOnce(JSON.stringify(value));
    const output = await sut.recover(key);
    expect(output).toEqual(value);
    expect(redisGetSpy).toHaveBeenCalledWith(key);
  });

  it('Should return null if redis.get not returns a value', async () => {
    const sut = createSut();
    const key = Chance().name();
    const redisGetSpy = jest.spyOn(mockedIoRedis.default.prototype, 'get');
    redisGetSpy.mockResolvedValueOnce(null);
    const output = await sut.recover(key);
    expect(output).toEqual(null);
    expect(redisGetSpy).toHaveBeenCalledWith(key);
  });

  it('Should call del to all keys found by its prefix', async () => {
    const sut = createSut();
    const prefix = Chance().word();
    const keys = [`${prefix}:${Chance().name()}`, `${prefix}:${Chance().name()}`];

    const getKeysSpy = jest.spyOn(mockedIoRedis.default.prototype, 'keys');
    getKeysSpy.mockResolvedValueOnce(keys);

    const pipelineSpy = jest.spyOn(mockedIoRedis.default.prototype, 'pipeline');
    const del = jest.fn();
    const exec = jest.fn();

    pipelineSpy.mockReturnValueOnce({
      del,
      exec,
    } as unknown as ioRedis.ChainableCommander);

    await sut.invalidatePrefix(prefix);
    expect(pipelineSpy).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenNthCalledWith(1, keys[0]);
    expect(del).toHaveBeenNthCalledWith(2, keys[1]);
    expect(exec).toHaveBeenCalledTimes(1);
  });
});
