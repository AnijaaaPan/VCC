import { CategoryChannel, ChannelType } from 'discord.js'
import { CustomInteraction } from '~/lib/GeneralInteraction'

export default async function createVoiceChannel(general: CustomInteraction, category?: CategoryChannel) {
  const { guild, i18n } = general

  const voiceChannel = await guild?.channels.create<ChannelType.GuildVoice>({
    name: i18n.commands.autoVc.channel.voiceName,
    parent: category?.id,
    type: ChannelType.GuildVoice,
    userLimit: 1,
  })

  return voiceChannel
}
