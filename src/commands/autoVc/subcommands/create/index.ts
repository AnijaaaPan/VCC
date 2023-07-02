import { ApplicationCommandOptionType, Locale, MessageCreateOptions } from 'discord.js'
import { Command, SubCommandPack, instance } from '~/commands/base'
import { maxLimitOption } from '~/commands/shards/options'
import createArchiveChannel from '~/features/vcAutoCreate/createArchiveChannel'
import createCategory from '~/features/vcAutoCreate/createCategory'
import createVcJoinRole from '~/features/vcAutoCreate/createVcJoinRole'
import createVoiceChannel from '~/features/vcAutoCreate/createVoiceChannel'
import { vcAutoCreateEmbed } from '~/features/vcAutoCreate/vcAutoCreateEmbeds'
import { CustomError } from '~/handlers/unhandledRejection'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import { VcAutoCreate } from '~/services/interface'
import { langLocal } from '~/utils/discord'

class CreateCommand extends Command {
  protected async main(): Promise<void> {
    const { guildId, i18n, interaction } = this.general
    const autoVcCreateI18n = i18n.commands.autoVc.create
    const maxLimit = this.options.getNumber(maxLimitOption.name)

    const vcAutoCreateService = new VcAutoCreateService(guildId)
    await this.guard(vcAutoCreateService)

    const func = async () => {
      await this.guard(vcAutoCreateService)

      const vcJoinRole = await createVcJoinRole(this.general)
      const category = await createCategory(this.general)
      const archive = await createArchiveChannel(this.general, category)
      const voice = await createVoiceChannel(this.general, category)

      const newVcAutoCreate: VcAutoCreate = {
        archiveId: archive?.id ?? '',
        categoryId: category?.id ?? '',
        maxLimit,
        roleId: vcJoinRole?.id ?? '',
        voiceId: voice?.id ?? '',
      }
      const vcAutoCreates = await vcAutoCreateService.get()
      const newVcAutoCreates = [...vcAutoCreates, newVcAutoCreate]
      await vcAutoCreateService.save(newVcAutoCreates)

      const embed = await vcAutoCreateEmbed(this.general, newVcAutoCreate)
      await interaction.editReply({
        content: autoVcCreateI18n.completed,
        embeds: [embed],
      })
    }

    const messageCreateOptions = {
      content: autoVcCreateI18n.contentYesNo,
    } as MessageCreateOptions
    await this.waitPushYesNoButton(messageCreateOptions, func, true)
  }

  private async guard(vcAutoCreateService: VcAutoCreateService) {
    const { i18n } = this.general
    const autoVcCreateI18n = i18n.commands.autoVc.create

    const vcAutoCreates = await vcAutoCreateService.get()
    if (vcAutoCreates.length === 3) {
      throw new CustomError(autoVcCreateI18n.createLimitCount)
    }
  }
}

const createAutoVc: SubCommandPack = {
  data: {
    description: langLocal().commands.autoVc.create.description,
    descriptionLocalizations: {
      ja: langLocal(Locale.Japanese).commands.autoVc.create.description,
    },
    name: 'create',
    options: [maxLimitOption],
    type: ApplicationCommandOptionType.Subcommand,
  },
  instance: instance(CreateCommand),
}

export default createAutoVc
