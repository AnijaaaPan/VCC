import { Locale } from 'discord.js'
import { langLocal } from '~/utils/discord'
import { Command, CommandPack, Guard, instance } from '../base'
import { adminGuard } from '../shards/guards'
import subcommands from './subcommands'

export class AutoVcCommand extends Command {
  protected guards: Guard[] = [adminGuard]

  protected async main(): Promise<void> {
    const subcommandName = this.options.getSubcommand()
    const subcommand = subcommands.find((c) => c.data.name === subcommandName)
    await subcommand?.instance(this.general).execute()
  }
}

const announce: CommandPack = {
  data: {
    description: langLocal().commands.autoVc.description,
    descriptionLocalizations: {
      ja: langLocal(Locale.Japanese).commands.autoVc.description,
    },
    name: 'auto-vc',
    options: subcommands.map((c) => c.data),
  },
  instance: instance(AutoVcCommand),
}

export default announce
