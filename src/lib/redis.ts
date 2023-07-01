import Redis from 'ioredis'
import config from '~/config'
import { logger } from './logger'

export let redis: Redis
export const KEY_SEPARATOR = ':'

export function redisConnect() {
  redis = new Redis(process.env.REDIS_URL ?? '', config.redisOptions)
  logger.info('**Redisに接続完了**')
}

export async function getData(guildId: string, ...keys: string[]) {
  const key = [guildId, ...keys].join(KEY_SEPARATOR)
  const res = await redis.get(key)
  return JSON.parse(res || 'null')
}

export async function getKeys(guildId: string, ...keys: string[]) {
  const key = [guildId, ...keys, '*'].join(KEY_SEPARATOR)
  const getKeys = await redis.keys(key)
  return getKeys
}

export async function saveData(guildId: string, body: unknown, ...keys: string[]) {
  const key = [guildId, ...keys].join(KEY_SEPARATOR)
  await redis.set(key, JSON.stringify(body))
}

export async function deleteData(guildId?: string, ...keys: string[]) {
  const key = [guildId, ...keys].join(KEY_SEPARATOR)
  await redis.del(key)
}
