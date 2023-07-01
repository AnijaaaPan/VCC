import { CategoryChannel, EmbedBuilder, TextChannel, VoiceChannel } from 'discord.js'
import { CustomInteraction } from '~/lib/GeneralInteraction'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import { getChannel } from '~/utils/discord'

export default async function vcAutoCreateEmbeds(general: CustomInteraction) {
  const { guild, guildId } = general
  const vcAutoCreateService = new VcAutoCreateService(guildId)
  const vcAutoCreates = await vcAutoCreateService.get()

  const embeds = await Promise.all(
    vcAutoCreates.map(async (d, i) => {
      const category = await getChannel<CategoryChannel>(d.categoryId, guild)
      const archive = await getChannel<TextChannel>(d.archiveId, guild)
      const voice = await getChannel<VoiceChannel>(d.voiceId, guild)

      const embed = new EmbedBuilder()
      embed.setTitle('VC自動作成一覧:')
      embed.addFields(
        {
          name: 'カテゴリー:',
          value: `${category}`,
          inline: false,
        },
        {
          name: 'アーカイブチャンネル:',
          value: `${archive}`,
          inline: false,
        },
        {
          name: 'VC自動作成チャンネル:',
          value: `${voice}`,
          inline: false,
        }
      )
      embed.setFooter({ text: `${i + 1} / ${vcAutoCreates.length} page` })
      return embed
    })
  )
  return embeds
}
