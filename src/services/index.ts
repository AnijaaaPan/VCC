import { deleteData, getData, getKeys, saveData } from '~/lib/redis'

export const REDIS_KEYS = {
  vcs: ['vcs'],
  vcAutoCreates: ['vcAutoCreates'],
}

export type RedisKeys = keyof typeof REDIS_KEYS

export class Service {
  constructor(protected guildId: string) {}

  protected async getData<T>(redisKeys: RedisKeys, ...optionKeys: string[]) {
    const keys = [...REDIS_KEYS[redisKeys], ...optionKeys]
    return (await getData(this.guildId, ...keys)) as T
  }

  protected async getKeys(redisKeys: RedisKeys, ...optionKeys: string[]): Promise<string[]> {
    const keys = [...REDIS_KEYS[redisKeys], ...optionKeys]
    return await getKeys(this.guildId, ...keys)
  }

  protected async saveData(body: unknown, redisKeys: RedisKeys, ...optionKeys: string[]) {
    const keys = [...REDIS_KEYS[redisKeys], ...optionKeys]
    await saveData(this.guildId, body, ...keys)
  }

  protected async deleteData(redisKeys: RedisKeys, ...optionKeys: string[]) {
    const keys = [...REDIS_KEYS[redisKeys], ...optionKeys]
    await deleteData(this.guildId, ...keys)
  }
}
