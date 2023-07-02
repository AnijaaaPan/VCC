import { GuildMember, VoiceChannel, VoiceState } from 'discord.js'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import VcService from '~/services/VcService'
import { VcAutoCreate } from '~/services/interface'
import { getChannel, getRole, lang } from '~/utils/discord'
import { format } from '~/utils/general'

export async function sendUserActivity(vcService: VcService, oldState: VoiceState, newState: VoiceState) {
  const state = newState.channel !== null ? newState : oldState
  const member = state.member
  const isConnected = newState.channel === null

  const vc = await vcService.getFromSomeId(state.channel?.id)
  if (!vc) return

  const channel = await getChannel<VoiceChannel>(vc.voiceChannelId, state.guild)
  if (!channel) return

  const i18n = lang(state.guild)
  const connectMsg = isConnected ? i18n.handlers.voiceStateUpdate.autoVc.update.connectVc : i18n.handlers.voiceStateUpdate.autoVc.update.disconnectVc
  await channel.send(format(connectMsg, state.id))

  const vcAutoCreateService = new VcAutoCreateService(state.guild.id)
  const vcAutoCreate = await vcAutoCreateService.getFromSomeId(state.channel?.parent?.id ?? '')
  if (!vcAutoCreate) return
  await updateRole(vcAutoCreate, member, isConnected)
}

async function updateRole(vcAutoCreate: VcAutoCreate, member: GuildMember | null, isConnected: boolean) {
  const role = await getRole(vcAutoCreate.roleId, member?.guild)
  if (!role) return

  if (isConnected) {
    await member?.roles.add(role).catch(() => {})
  } else {
    await member?.roles.remove(role).catch(() => {})
  }
}
