import {
  ApplicationCommandSubCommandData,
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ComponentType,
  InteractionReplyOptions,
  MessageCreateOptions,
  TextChannel,
} from 'discord.js'
import { errorHandlingInteraction } from '~/handlers/unhandledRejection'
import GeneralInteraction, { CustomInteraction } from '~/lib/GeneralInteraction'
import { COMPONENTS_YES_NO, CUSTOM_ID } from '~/utils/buttons'

const EMPTY_OPTIONS = { embeds: [], components: [] } as MessageCreateOptions

interface BasePack {
  instance: ReturnType<typeof instance>
}

export interface CommandPack extends BasePack {
  data: ChatInputApplicationCommandData
}

export interface SubCommandPack extends BasePack {
  data: ApplicationCommandSubCommandData
}

export function instance<T extends typeof Command>(CommandType: new (...args: ConstructorParameters<T>) => Command) {
  return (...args: ConstructorParameters<T>) => new CommandType(...args)
}

export type Guard = (general: CustomInteraction) => Promise<void> | void

export abstract class Command {
  options: CommandInteractionOptionResolver
  constructor(protected general: GeneralInteraction<CommandInteraction>) {
    const { interaction } = general
    this.options = interaction.options as CommandInteractionOptionResolver
  }

  protected abstract main(): Promise<void> | void
  protected guards: Guard[] = []

  public async execute() {
    try {
      await Promise.all(this.guards.map(async (guard) => await guard(this.general)))
      await this.main()
    } catch (error) {
      await this.onError(error as Error)
    }
  }

  protected async waitPushYesNoButton(messageCreateOptions: MessageCreateOptions, pushButtonFunc: () => Promise<void> | void, isDontReply: boolean = false) {
    const { interaction, i18n } = this.general
    const replyOptions = messageCreateOptions as InteractionReplyOptions

    if (interaction.replied === false && interaction.deferred === false) {
      await interaction.reply({ ...replyOptions, components: COMPONENTS_YES_NO, ephemeral: true })
    } else {
      await interaction.editReply({ ...replyOptions, components: COMPONENTS_YES_NO })
    }

    const channel = interaction.channel as TextChannel
    const collector = channel?.createMessageComponentCollector({
      componentType: ComponentType.Button,
      idle: 10000,
    })
    collector?.on('collect', async (i) => {
      collector.stop()

      await i.deferUpdate()
      if (i.customId === CUSTOM_ID.NO) {
        await i.editReply({ ...EMPTY_OPTIONS, content: i18n.commands.buttonYesNo.cancel })
        return
      }

      await i.editReply({ ...EMPTY_OPTIONS, content: i18n.commands.processing })
      await pushButtonFunc()

      if (isDontReply === true) return
      await i.editReply({ ...EMPTY_OPTIONS, content: i18n.commands.buttonYesNo.done }).catch(() => {})
    })
  }

  private async onError(error: Error) {
    const { interaction } = this.general
    await errorHandlingInteraction(error, interaction)
  }
}
