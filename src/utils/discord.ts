import { Guild, GuildBasedChannel, Locale, TextChannel } from 'discord.js'
import { I18n } from '~/assets/i18n'
import en from '~/assets/i18n/en'
import ja from '~/assets/i18n/ja'
import { client } from '..'

export function lang(guild: Guild | null): I18n {
  const local = guild?.preferredLocale
  if (local === Locale.Japanese) return ja
  return en
}

export function langLocal(local?: Locale): I18n {
  if (local === Locale.Japanese) return ja
  return en
}

export async function getWebhook(channelId?: string, guild?: Guild | null) {
  const channel = await getChannel<TextChannel>(channelId, guild)
  if (!channel) return

  const webhooks = await channel.fetchWebhooks()
  const webhook = webhooks.first()
  return webhook
}

export async function getChannel<T extends GuildBasedChannel>(channelId?: string, guild?: Guild | null) {
  const manager = guild ?? client
  const getChannel = manager?.channels.cache.get(channelId ?? '')
  if (getChannel) {
    return getChannel ? (getChannel as T) : undefined
  }

  const fetchchannel = await manager?.channels.fetch(channelId ?? '')
  return fetchchannel ? (fetchchannel as T) : undefined
}
