import { deleteData, getData, getKeys, saveData } from '~/lib/redis'

export const REDIS_KEYS = {
  vcs: ['vcs'],
  vcAutoCreates: ['vcAutoCreates'],
}

export type RedisKeys = keyof typeof REDIS_KEYS

export class Service<T> {
  constructor(
    protected guildId: string,
    protected keys: RedisKeys
  ) { }

  private generateKey(...optionKeys: string[]) {
    const keys = [...REDIS_KEYS[this.keys], ...optionKeys]
    return keys
  }

  protected async getData(...optionKeys: string[]) {
    const keys = this.generateKey(...optionKeys)
    return (await getData(this.guildId, ...keys)) as T[]
  }

  protected async getKeys(...optionKeys: string[]): Promise<string[]> {
    const keys = this.generateKey(...optionKeys)
    return await getKeys(this.guildId, ...keys)
  }

  protected async saveData(body: unknown, ...optionKeys: string[]) {
    const keys = this.generateKey(...optionKeys)
    await saveData(this.guildId, body, ...keys)
  }

  protected async deleteData(...optionKeys: string[]) {
    const keys = this.generateKey(...optionKeys)
    await deleteData(this.guildId, ...keys)
  }
}
