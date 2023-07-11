import { CategoryChannel, TextChannel, VoiceChannel, WebhookMessageCreateOptions } from 'discord.js'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import { getChannel, getWebhook } from '~/utils/discord'
import { fetchMessages } from '~/utils/fetchInviteMember'

async function archiveVc(vcChannel: VoiceChannel) {
  const guild = vcChannel.guild
  const categoryId = vcChannel.parent?.id ?? ''
  const vcAutoCreateService = new VcAutoCreateService(guild.id)
  const vcAutoCreate = await vcAutoCreateService.getVcAutoCreateByCategory(categoryId)
  if (!vcAutoCreate) return

  const webhook = await getWebhook(vcAutoCreate.archiveId, guild)
  const messages = await fetchMessages(guild, vcChannel.id)
  const reversed = messages?.reverse()
  if (reversed?.some((m) => !m.author.bot)) {
    const archive = await getChannel<TextChannel>(vcAutoCreate.archiveId, guild)
    const thread = await archive?.threads.create({ name: vcChannel.name, autoArchiveDuration: 60 })

    for (const m in reversed) {
      const message = reversed[m]
      const webhookSend: WebhookMessageCreateOptions = {
        username: `${message.author.tag}(ID: ${message.author.id})`,
        avatarURL: message.author.displayAvatarURL({ extension: 'png' }),
        threadId: thread?.id,
        allowedMentions: { parse: [] },
      }

      if (message.content) webhookSend.content = message.content
      if (message.embeds) webhookSend.embeds = message.embeds
      if (message.attachments) webhookSend.files = message.attachments.map((attachment) => attachment.url)
      await webhook?.send(webhookSend).catch(() => { })
    }
  }

  await vcChannel.delete()

  const category = await getChannel<CategoryChannel>(categoryId, guild)
  if (category?.children.cache.size !== 0) return
  await category.delete()
  await vcAutoCreateService.updateExtraCategoryId(vcAutoCreate, categoryId, false)
}

export default archiveVc
