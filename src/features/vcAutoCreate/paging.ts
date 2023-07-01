import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CategoryChannel, TextChannel, VoiceChannel } from 'discord.js'
import { CustomError } from '~/handlers/unhandledRejection'
import { CustomInteraction } from '~/lib/GeneralInteraction'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import { CUSTOM_ID } from '~/utils/buttons'
import { getChannel } from '~/utils/discord'
import vcAutoCreateEmbeds from './vcAutoCreateEmbeds'

export default async function paging(general: CustomInteraction, isDelete: boolean = false) {
  const { channel, guildId, i18n, interaction } = general
  const vcAutoCreateService = new VcAutoCreateService(guildId)
  const vcAutoCreates = await vcAutoCreateService.get()
  if (!vcAutoCreates.length) {
    throw new CustomError(i18n.commands.autoVc.undefined)
  }

  const buttons = getButtons(vcAutoCreates.length, isDelete)
  let selectPageIndex = 0
  const embeds = await vcAutoCreateEmbeds(general)
  await interaction.editReply({
    embeds: [embeds[selectPageIndex]],
    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons)],
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
        content: '>>> **※削除が完了しました**',
        embeds: [],
        components: [],
      })
      return
    }

    buttons[0].setDisabled(selectPageIndex === 0)
    buttons[1].setDisabled(selectPageIndex === vcAutoCreates.length - 1)

    await i.update({
      embeds: [embeds[selectPageIndex]],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons)],
    })
  })

  collector?.on('end', async () => {
    await interaction.editReply({
      embeds: [embeds[selectPageIndex]],
      components: [],
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

  if (archive) await archive.delete()
  if (voice) await voice.delete()
  if (category) await category.delete()

  await vcAutoCreateService.updateIsDetele(vcAutoCreate, true)
}
