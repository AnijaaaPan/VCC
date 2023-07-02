import { ChannelType, EmbedBuilder, GuildMember, VoiceChannel, VoiceState } from 'discord.js'
import { I18n } from '~/assets/i18n'
import { CustomError } from '~/handlers/unhandledRejection'
import VcService from '~/services/VcService'
import { Vc, VcAutoCreate } from '~/services/interface'
import { getChannel, getRole, lang } from '~/utils/discord'
import { format } from '~/utils/general'

export default async function autoCreate(vcService: VcService, newState: VoiceState, vcAutoCreate: VcAutoCreate) {
  const guild = newState.guild
  const member = newState.member
  const i18n = lang(guild)

  const vc = await vcService.getFromSomeId(newState.member?.id)
  if (vc) {
    await getChannel<VoiceChannel>(vc.voiceChannelId, guild).then(async (channel) => {
      if (channel) await member?.voice.setChannel(channel)
    })
    return
  }

  let vcChannel: VoiceChannel | undefined

  try {
    vcChannel = await createVoiceChannel(newState, vcAutoCreate, i18n)
    await addRole(vcAutoCreate, member)

    const vcs = await vcService.get()
    const newVc: Vc = {
      guildId: guild.id,
      isDelete: false,
      userId: member?.id ?? '',
      voiceChannelId: vcChannel.id,
    }
    const newVcs = [...vcs, newVc]
    await vcService.save(newVcs)
  } catch (e) {
    if (vcChannel) vcChannel.delete()
  }
}

async function createVoiceChannel(newState: VoiceState, vcAutoCreate: VcAutoCreate, i18n: I18n): Promise<VoiceChannel> {
  return await new Promise((resolve) => {
    const member = newState.member

    newState.guild.channels
      .create<ChannelType.GuildVoice>({
        name: `${newState.member?.displayName}`,
        type: ChannelType.GuildVoice,
        parent: vcAutoCreate.categoryId,
        userLimit: vcAutoCreate.maxLimit ?? undefined,
      })
      .then(async (vcChannel) => {
        await member?.voice.setChannel(vcChannel)
        await sendAutoCreateMessage(vcChannel, member, i18n)
        resolve(vcChannel)
      })
      .catch(() => {
        throw new CustomError(i18n.handlers.voiceStateUpdate.autoVc.create.errorVoiceChannel)
      })
  })
}

async function sendAutoCreateMessage(vcChannel: VoiceChannel, member: GuildMember | null, i18n: I18n) {
  const embed = new EmbedBuilder()
  embed.setTitle(format(i18n.handlers.voiceStateUpdate.autoVc.create.sendEmbed.title, member?.displayName))
  embed.setDescription(format(i18n.handlers.voiceStateUpdate.autoVc.create.sendEmbed.description, vcChannel))
  embed.addFields(
    {
      name: i18n.handlers.voiceStateUpdate.autoVc.create.sendEmbed.fields[0].name,
      value: format(i18n.handlers.voiceStateUpdate.autoVc.create.sendEmbed.fields[0].value, member),
      inline: false,
    },
    {
      name: i18n.handlers.voiceStateUpdate.autoVc.create.sendEmbed.fields[1].name,
      value: i18n.handlers.voiceStateUpdate.autoVc.create.sendEmbed.fields[1].value,
      inline: false,
    }
  )
  await vcChannel.send({ content: `${member}`, embeds: [embed] })
}

async function addRole(vcAutoCreate: VcAutoCreate, member: GuildMember | null) {
  const role = await getRole(vcAutoCreate.roleId, member?.guild)
  if (!role) return

  await member?.roles.add(role).catch(() => {})
}
