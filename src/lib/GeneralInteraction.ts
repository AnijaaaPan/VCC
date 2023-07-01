import { ButtonInteraction, CommandInteraction, Guild, TextBasedChannel, User } from 'discord.js'
import { I18n } from '~/assets/i18n'
import { lang } from '~/utils/discord'

export type CustomInteraction = GeneralInteraction<CommandInteraction | ButtonInteraction>

export default class GeneralInteraction<T extends CommandInteraction | ButtonInteraction> {
  interaction: T
  i18n: I18n
  channel: TextBasedChannel | null
  channelId: string
  guild: Guild | null
  guildId: string
  user: User
  userId: string

  constructor(interaction: T) {
    this.interaction = interaction
    this.i18n = lang(interaction.guild)
    this.channel = interaction.channel
    this.channelId = this.channel?.id ?? ''
    this.guild = interaction.guild
    this.guildId = this.guild?.id ?? ''
    this.user = interaction.user
    this.userId = this.user.id
  }
}
