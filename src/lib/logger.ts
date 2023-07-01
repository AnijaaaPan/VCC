import { ColorResolvable, Colors, EmbedBuilder, Webhook } from 'discord.js'
import config from '~/config'
import { getWebhook } from '~/utils/discord'
import { isProd } from '~/utils/general'
import { client } from '..'

export let logger: Logger

export class Logger {
  webhook?: Webhook
  username: string
  avatarURL: string

  constructor() {
    this.username = client.user?.tag ?? ''
    this.avatarURL = client.user?.avatarURL() ?? ''
  }

  async set() {
    const channelId = config.discord.defaultLogChannelId
    this.webhook = await getWebhook(channelId)
    logger = this
  }

  private async sendLog(content: string, color: ColorResolvable, isMention: boolean = false) {
    if (!this.webhook) return

    const embed = new EmbedBuilder()
    embed.setDescription(content)
    embed.setTimestamp()
    embed.setColor(color)
    await this.webhook?.send({
      content: isProd && isMention ? `<@&${config.discord.errorMentionRoleId}>` : undefined,
      embeds: [embed],
      username: this.username,
      avatarURL: this.avatarURL,
    })
  }

  error(content: string) {
    this.sendLog(content, Colors.Red)
    console.error(content)
  }

  warn(content: string) {
    this.sendLog(content, Colors.Yellow)
    console.warn(content)
  }

  info(content: string) {
    this.sendLog(content, Colors.Blue)
    console.info(content)
  }

  debug(content: string) {
    this.sendLog(content, Colors.Grey)
    console.debug(content)
  }
}
