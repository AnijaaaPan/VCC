import { Interaction } from 'discord.js'
import commands from '~/commands'
import GeneralInteraction from '~/lib/GeneralInteraction'

export default async function interactionCreate(interaction: Interaction) {
  if (!interaction.isCommand()) return

  const general = new GeneralInteraction(interaction)
  const command = commands.find((c) => c.data.name === interaction.commandName)
  await command?.instance(general).execute()
}
