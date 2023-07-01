import { ApplicationCommandOptionType, Locale, MessageCreateOptions } from 'discord.js'
import { Command, SubCommandPack, instance } from '~/commands/base'
import createArchiveChannel from '~/features/vcAutoCreate/createArchiveChannel'
import createCategory from '~/features/vcAutoCreate/createCategory'
import createVoiceChannel from '~/features/vcAutoCreate/createVoiceChannel'
import { CustomError } from '~/handlers/unhandledRejection'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import { VcAutoCreate } from '~/services/interface'
import { langLocal } from '~/utils/discord'

class CreateCommand extends Command {
  protected async main(): Promise<void> {
    const { guildId, i18n } = this.general
    const autoVcCreateI18n = i18n.commands.autoVc.create

    const vcAutoCreateService = new VcAutoCreateService(guildId)
    const vcAutoCreates = await vcAutoCreateService.get()
    if (vcAutoCreates.length === 3) {
      throw new CustomError(autoVcCreateI18n.createLimitCount)
    }

    const func = async () => {
      const category = await createCategory(this.general)
      const archive = await createArchiveChannel(this.general, category)
      const voice = await createVoiceChannel(this.general, category)

      const newVcAutoCreate: VcAutoCreate = {
        archiveId: archive?.id ?? '',
        categoryId: category?.id ?? '',
        voiceId: voice?.id ?? '',
      }
      const vcAutoCreates = await vcAutoCreateService.get()
      const newVcAutoCreates = [...vcAutoCreates, newVcAutoCreate]
      await vcAutoCreateService.save(newVcAutoCreates)
    }

    const messageCreateOptions = {
      content: autoVcCreateI18n.contentYesNo,
    } as MessageCreateOptions
    await this.waitPushYesNoButton(messageCreateOptions, func)
  }
}

const addAutoVc: SubCommandPack = {
  data: {
    description: langLocal().commands.autoVc.create.description,
    descriptionLocalizations: {
      ja: langLocal(Locale.Japanese).commands.autoVc.create.description,
    },
    name: 'create',
    type: ApplicationCommandOptionType.Subcommand,
  },
  instance: instance(CreateCommand),
}

export default addAutoVc
