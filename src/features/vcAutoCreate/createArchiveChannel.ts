import { CategoryChannel, ChannelType } from 'discord.js'
import { CustomInteraction } from '~/lib/GeneralInteraction'

export default async function createArchiveChannel(general: CustomInteraction, category?: CategoryChannel) {
  const { guild, i18n } = general

  const textChannel = await guild?.channels.create({
    name: i18n.commands.autoVc.create.archiveChannel,
    parent: category?.id,
    type: ChannelType.GuildText,
  })

  return textChannel
}
