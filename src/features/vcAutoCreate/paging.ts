import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, TextChannel, VoiceChannel } from 'discord.js'
import { CustomError } from '~/handlers/unhandledRejection'
import { CustomInteraction } from '~/lib/GeneralInteraction'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import { CUSTOM_ID } from '~/utils/buttons'
import { getChannel, getRole } from '~/utils/discord'
import vcAutoCreateEmbeds from './vcAutoCreateEmbeds'

export default async function paging(general: CustomInteraction, isDelete: boolean = false) {
  const { channel, guildId, i18n, interaction } = general
  const vcAutoCreateService = new VcAutoCreateService(guildId)
  const vcAutoCreates = await vcAutoCreateService.get()
  if (!vcAutoCreates.length) {
    throw new CustomError(i18n.commands.autoVc.undefined)
  }

  let selectPageIndex = 0
  const buttons = getButtons(vcAutoCreates.length, isDelete)
  const components = !buttons.length ? [] : [new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons)]
  const embeds = await vcAutoCreateEmbeds(general)
  await interaction.editReply({
    embeds: [embeds[selectPageIndex]],
    components,
  })

  const filter = (i: { customId: string }) => i.customId === CUSTOM_ID.BACK || i.customId === CUSTOM_ID.NEXT || i.customId === CUSTOM_ID.DELETE
  const collector = channel?.createMessageComponentCollector({
    filter,
    idle: 60000,
  })
  collector?.on('collect', async (i) => {
    if (i.customId === CUSTOM_ID.BACK) {
      selectPageIndex--

    } else if (i.customId === CUSTOM_ID.NEXT) {
      selectPageIndex++

    } else if (i.customId === CUSTOM_ID.DELETE) {
      await deleteVcAutoCreate(general, selectPageIndex)
      await i.update({
        components: [],
        content: i18n.commands.autoVc.delete.completed,
        embeds: []
      })
      return
    }

    buttons[0].setDisabled(selectPageIndex === 0)
    buttons[1].setDisabled(selectPageIndex === vcAutoCreates.length - 1)

    await i.update({
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons)],
      embeds: [embeds[selectPageIndex]]
    })
  })

  collector?.on('end', async () => {
    await interaction.editReply({
      components: [],
      embeds: [embeds[selectPageIndex]]
    })
  })
}

function getButtons(indexCount: number, isDelete: boolean) {
  const buttons: ButtonBuilder[] = []
  if (indexCount !== 1) {
    buttons.push(new ButtonBuilder().setCustomId(CUSTOM_ID.BACK).setStyle(ButtonStyle.Secondary).setEmoji('◀').setDisabled(true))
    buttons.push(new ButtonBuilder().setCustomId(CUSTOM_ID.NEXT).setStyle(ButtonStyle.Secondary).setEmoji('▶'))
  }

  if (isDelete) {
    buttons.push(new ButtonBuilder().setCustomId(CUSTOM_ID.DELETE).setStyle(ButtonStyle.Danger).setEmoji('🗑️'))
  }
  return buttons
}

async function deleteVcAutoCreate(general: CustomInteraction, selectPageIndex: number) {
  const { guild, guildId } = general

  const vcAutoCreateService = new VcAutoCreateService(guildId)
  const vcAutoCreates = await vcAutoCreateService.get()
  const vcAutoCreate = vcAutoCreates[selectPageIndex]

  const category = await getChannel<CategoryChannel>(vcAutoCreate.categoryId, guild)
  const archive = await getChannel<TextChannel>(vcAutoCreate.archiveId, guild)
  const voice = await getChannel<VoiceChannel>(vcAutoCreate.voiceId, guild)
  const role = await getRole(vcAutoCreate.roleId, guild)

  if (archive) await archive.delete()
  if (voice) await voice.delete()
  if (category) await category.delete()
  if (role) await role.delete()

  await vcAutoCreateService.updateIsDetele(vcAutoCreate)
}
