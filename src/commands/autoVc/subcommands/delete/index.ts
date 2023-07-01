import { ApplicationCommandOptionType, Locale } from 'discord.js'
import { Command, SubCommandPack, instance } from '~/commands/base'
import paging from '~/features/vcAutoCreate/paging'
import { langLocal } from '~/utils/discord'

class DeleteCommand extends Command {
  protected async main(): Promise<void> {
    const { interaction } = this.general
    await interaction.deferReply({ ephemeral: true })

    await paging(this.general, true)
  }
}

const deleteAutoVc: SubCommandPack = {
  data: {
    description: langLocal().commands.autoVc.delete.description,
    descriptionLocalizations: {
      ja: langLocal(Locale.Japanese).commands.autoVc.delete.description,
    },
    name: 'delete',
    type: ApplicationCommandOptionType.Subcommand,
  },
  instance: instance(DeleteCommand),
}

export default deleteAutoVc
