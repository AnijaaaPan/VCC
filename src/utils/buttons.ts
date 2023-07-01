import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export const CUSTOM_ID = {
  YES: 'yes',
  NO: 'no',
  BACK: 'back',
  NEXT: 'next',
  DELETE: 'delete',
}

const BUTTON_YES = new ButtonBuilder().setCustomId(CUSTOM_ID.YES).setStyle(ButtonStyle.Secondary).setEmoji('✅')
const BUTTON_NO = new ButtonBuilder().setCustomId(CUSTOM_ID.NO).setStyle(ButtonStyle.Secondary).setEmoji('❌')

export const COMPONENTS_YES_NO = [new ActionRowBuilder<ButtonBuilder>().addComponents(BUTTON_YES, BUTTON_NO)]
