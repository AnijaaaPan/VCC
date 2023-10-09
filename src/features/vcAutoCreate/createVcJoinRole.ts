import { Colors } from 'discord.js'
import { CustomInteraction } from '~/lib/GeneralInteraction'

export default async function createVcJoinRole(general: CustomInteraction) {
  const { guild, i18n } = general

  const vcJoinRole = await guild?.roles.create({
    color: Colors.Green,
    hoist: true,
    mentionable: false,
    name: i18n.commands.autoVc.role.name
  })
  return vcJoinRole
}
