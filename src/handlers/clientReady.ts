import { Collection } from 'discord.js'
import commands from '~/commands'
import { Logger, logger } from '~/lib/logger'
import { redisConnect } from '~/lib/redis'
import { client } from '..'

export const invites = new Collection<string, Collection<string, number | null>>()

export default async function clientReady() {
  await new Logger().set()
  redisConnect()
  logger.info(`Logged in: ${client.user?.tag}`)

  client.guilds.cache.forEach(async (guild) => {
    await client.application?.commands.set(
      commands.map((d) => d.data),
      guild.id
    )
  })

  client.user?.setPresence({ activities: [{ name: '/auto-vc' }] })
}
