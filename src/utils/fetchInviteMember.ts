import { Collection, Guild, Message, TextChannel } from 'discord.js'
import { getChannel } from './discord'

export const LOG_START_AT = '2022-01-01'
export const START_AT_NUMBER = Date.parse(new Date(LOG_START_AT).toString())

/**
 * 特定の期間のメッセージリストを返す
 */
export async function fetchMessages(guild: Guild, channelId: string, startAt: number = START_AT_NUMBER, endAt: number = Date.now()) {
  const channel = await getChannel<TextChannel>(channelId, guild)
  if (!channel) return

  const messages = toArray(await channel.messages.fetch({ limit: 100 }))
  if (messages.length === 0) return

  let lastMessage: Message = messages[messages.length - 1]
  while (isBetweenTerm(lastMessage, startAt, endAt)) {
    const ms = await channel.messages.fetch({ limit: 100, before: lastMessage.id })
    if (!ms.size) break

    messages.push(...toArray(ms))
    lastMessage = messages[messages.length - 1]
  }

  // テストのため省いているが、念の為 Bot からのメッセージであることも判定した方がよい
  return messages.filter((m) => isBetweenTerm(m, startAt, endAt))
}

function isBetweenTerm(message: Message, startAt: number, endAt: number) {
  const createdTimestamp = message.createdTimestamp
  return createdTimestamp >= startAt && createdTimestamp < endAt
}

function toArray(map: Collection<string, Message>) {
  return Array.from(map.values())
}
