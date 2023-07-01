import { ApplicationCommandOptionData, ApplicationCommandOptionType, ApplicationCommandSubCommandData, ApplicationCommandSubGroupData, Locale } from 'discord.js'
import { langLocal } from '~/utils/discord'

type SubCommandOptionData = Exclude<ApplicationCommandOptionData, ApplicationCommandSubGroupData | ApplicationCommandSubCommandData>

export const channelNameOption: SubCommandOptionData = {
  description: langLocal().commands.options.channelName,
  descriptionLocalizations: {
    ja: langLocal(Locale.Japanese).commands.options.channelName,
  },
  name: 'name',
  type: ApplicationCommandOptionType.String,
}
