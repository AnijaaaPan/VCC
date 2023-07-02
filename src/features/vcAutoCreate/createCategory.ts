import { ChannelType } from 'discord.js'
import { CustomInteraction } from '~/lib/GeneralInteraction'

export default async function createCategory(general: CustomInteraction) {
  const { guild, i18n } = general

  const category = await guild?.channels.create<ChannelType.GuildCategory>({
    name: i18n.commands.autoVc.channel.categoryName,
    type: ChannelType.GuildCategory,
  })
  return category
}
