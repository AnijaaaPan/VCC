import { BaseInteraction } from 'discord.js'
import { logger } from '~/lib/logger'

export class CustomError extends Error {
  type: string = 'custom'
}

export function errorHandling(error: unknown) {
  const e = error as Error
  logger.error(`\`\`\`js\n${e.stack}\`\`\``)
}

export async function errorHandlingInteraction(error: unknown, interaction?: BaseInteraction) {
  if (!interaction?.isCommand() && !interaction?.isButton()) return

  const e = error as Error
  if ('type' in e === false) {
    errorHandling(e)
    return
  }

  const replyOption = {
    content: e.message,
    ephemeral: true,
  }

  if (!interaction.replied && !interaction.deferred) {
    await interaction.reply(replyOption).catch(async () => {
      await interaction.user.send(e.message)
    })
    return
  }

  await interaction.editReply(replyOption)
}
