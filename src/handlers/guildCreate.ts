import { Guild } from 'discord.js'
import commands from '~/commands'
import { client } from '..'

export default async function guildCreate(guild: Guild) {
  await client.application?.commands.set(
    commands.map((d) => d.data),
    guild.id
  )
}
