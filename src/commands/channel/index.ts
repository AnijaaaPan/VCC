import { Locale, MessageCreateOptions, VoiceChannel } from 'discord.js'
import { CustomError } from '~/handlers/unhandledRejection'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import VcService from '~/services/VcService'
import { Vc } from '~/services/interface'
import { getChannel, langLocal } from '~/utils/discord'
import { format } from '~/utils/general'
import { Command, CommandPack, Guard, instance } from '../base'
import { channelNameOption } from '../shards/options'

class ChannelCommand extends Command {
  protected guards: Guard[] = []

  protected async main(): Promise<void> {
    const { guild, guildId, i18n, interaction, userId } = this.general
    const commandsChannelI18n = i18n.commands.channel
    const name = this.options.getString(channelNameOption.name, true)
    const nameLength = name?.length ?? 0

    const vc = await new VcService(guildId).getFromSomeId(userId)
    await this.guard(nameLength, vc)
    const voiceChannel = await getChannel<VoiceChannel>(vc?.voiceChannelId, guild)

    const func = async () => {
      await voiceChannel
        ?.setName(name)
        .then(async () => {
          await interaction.editReply(format(commandsChannelI18n.success, voiceChannel))
        })
        .catch(async (error) => {
          if (error.code !== 50035) return
          await interaction.editReply(format(commandsChannelI18n.errorCode50035, voiceChannel))
        })
    }

    const messageCreateOptions = {
      content: format(commandsChannelI18n.contentYesNo, voiceChannel, name),
    } as MessageCreateOptions
    await this.waitPushYesNoButton(messageCreateOptions, func, true)
  }

  private async guard(nameLength: number, vc?: Vc) {
    const { guildId, i18n, userId } = this.general

    const commandsChannelI18n = i18n.commands.channel
    if (!vc) {
      const vcAutoCreates = await new VcAutoCreateService(guildId).get()
      const channelList = vcAutoCreates.map((vc) => `<#${vc.voiceId}>`).join('\n')
      throw new CustomError(format(commandsChannelI18n.notTargetChannel, channelList))
    }

    if (vc.userId !== userId) {
      throw new CustomError(commandsChannelI18n.notOwnChannel)
    }

    if (nameLength > 100) {
      throw new CustomError(commandsChannelI18n.nameLengthLimit)
    }
  }
}

const channel: CommandPack = {
  data: {
    name: 'channel',
    description: langLocal().commands.channel.description,
    descriptionLocalizations: {
      ja: langLocal(Locale.Japanese).commands.channel.description,
    },
    options: [{ ...channelNameOption, required: true }],
  },
  instance: instance(ChannelCommand),
}

export default channel
