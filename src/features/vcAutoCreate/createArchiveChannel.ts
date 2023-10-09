import { CategoryChannel, ChannelType, EmbedBuilder } from 'discord.js'
import { client } from '~/index'
import { CustomInteraction } from '~/lib/GeneralInteraction'
import { format } from '~/utils/general'

export default async function createArchiveChannel(general: CustomInteraction, category?: CategoryChannel) {
  const { guild, i18n } = general
  const archiveI18n = i18n.commands.autoVc.channel.archive

  const textChannel = await guild?.channels.create<ChannelType.GuildText>({
    name: archiveI18n.name,
    parent: category?.id,
    type: ChannelType.GuildText,
  })

  const embed = new EmbedBuilder()
    .setTitle(archiveI18n.sendEmbed.title)
    .setDescription(archiveI18n.sendEmbed.description)
    .addFields({
      name: archiveI18n.sendEmbed.fields[0].name,
      value: format(archiveI18n.sendEmbed.fields[0].value, client.user)
    })

  await textChannel?.createWebhook({ name: 'Log Webhook' })
  await textChannel?.send({
    embeds: [embed]
  })
  return textChannel
}
