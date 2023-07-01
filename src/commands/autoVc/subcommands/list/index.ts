import { ApplicationCommandOptionType, Locale } from 'discord.js'
import { Command, SubCommandPack, instance } from '~/commands/base'
import paging from '~/features/vcAutoCreate/paging'
import { langLocal } from '~/utils/discord'

class ListCommand extends Command {
  protected async main(): Promise<void> {
    const { interaction } = this.general
    await interaction.deferReply({ ephemeral: true })

    await paging(this.general)
  }
}

const listAutoVc: SubCommandPack = {
  data: {
    description: langLocal().commands.autoVc.list.description,
    descriptionLocalizations: {
      ja: langLocal(Locale.Japanese).commands.autoVc.list.description,
    },
    name: 'list',
    type: ApplicationCommandOptionType.Subcommand,
  },
  instance: instance(ListCommand),
}

export default listAutoVc
