import { CategoryChannel, EmbedBuilder, TextChannel, VoiceChannel } from 'discord.js'
import { CustomInteraction } from '~/lib/GeneralInteraction'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import { VcAutoCreate } from '~/services/interface'
import { getChannel, getRole } from '~/utils/discord'
import { format } from '~/utils/general'

export default async function vcAutoCreateEmbeds(general: CustomInteraction) {
  const { guildId } = general
  const vcAutoCreateService = new VcAutoCreateService(guildId)
  const vcAutoCreates = await vcAutoCreateService.get()

  const embeds = await Promise.all(
    vcAutoCreates.map(async (vcAutoCreate, i) => {
      const embed = await vcAutoCreateEmbed(general, vcAutoCreate)
      embed.setFooter({ text: `${i + 1} / ${vcAutoCreates.length} page` })
      return embed
    })
  )
  return embeds
}

export async function vcAutoCreateEmbed(general: CustomInteraction, vcAutoCreate: VcAutoCreate) {
  const { guild, i18n } = general
  const vcAutoCreateEmbeI18n = i18n.commands.autoVc.vcAutoCreateEmbed

  const category = (await getChannel<CategoryChannel>(vcAutoCreate.categoryId, guild)) ?? vcAutoCreateEmbeI18n.undefinedChannel
  const archive = (await getChannel<TextChannel>(vcAutoCreate.archiveId, guild)) ?? vcAutoCreateEmbeI18n.undefinedChannel
  const voice = (await getChannel<VoiceChannel>(vcAutoCreate.voiceId, guild)) ?? vcAutoCreateEmbeI18n.undefinedChannel
  const role = (await getRole(vcAutoCreate.roleId, guild)) ?? vcAutoCreateEmbeI18n.undefinedRole

  const embed = new EmbedBuilder()
  embed.setTitle(vcAutoCreateEmbeI18n.title)
  embed.addFields(
    {
      name: vcAutoCreateEmbeI18n.fields[0].name,
      value: format(vcAutoCreateEmbeI18n.fields[0].value, category),
      inline: false,
    },
    {
      name: vcAutoCreateEmbeI18n.fields[1].name,
      value: format(vcAutoCreateEmbeI18n.fields[1].value, archive),
      inline: false,
    },
    {
      name: vcAutoCreateEmbeI18n.fields[2].name,
      value: format(vcAutoCreateEmbeI18n.fields[2].value, voice),
      inline: false,
    },
    {
      name: vcAutoCreateEmbeI18n.fields[3].name,
      value: format(vcAutoCreateEmbeI18n.fields[3].value, role),
      inline: false,
    }
  )
  return embed
}
