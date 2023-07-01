import { PermissionFlagsBits } from 'discord.js'
import { CustomError } from '~/handlers/unhandledRejection'
import { CustomInteraction } from '~/lib/GeneralInteraction'

export function adminGuard(general: CustomInteraction) {
  const { interaction, i18n } = general
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    throw new CustomError(i18n.commands.guards.noPermission)
  }
}
